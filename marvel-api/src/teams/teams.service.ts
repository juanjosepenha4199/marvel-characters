import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team } from './team.entity';
import { Character } from '../characters/character.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  findAll() {
    return this.teamRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`No existe el equipo con id ${id}`);
    }
    return team;
  }

  async findCharacters(id: number) {
    await this.findOne(id);
    return this.characterRepository.find({
      where: { team_id: id },
      order: { id: 'ASC' },
    });
  }

  async create(dto: CreateTeamDto) {
    const { characterIds, ...data } = dto;
    await this.checkName(data.name);

    // se valida todo antes de guardar para no dejar el equipo creado a medias
    if (characterIds?.length) {
      await this.checkCharactersExist(characterIds);
      if (data.active === false) {
        throw new BadRequestException(
          'No se pueden asignar personajes a un equipo inactivo',
        );
      }
    }

    const team = await this.teamRepository.save(
      this.teamRepository.create(data),
    );
    if (!characterIds?.length) return team;

    await this.characterRepository.update(
      { id: In(characterIds) },
      { team_id: team.id },
    );
    return { ...team, characters: await this.findCharacters(team.id) };
  }

  async update(id: number, dto: UpdateTeamDto) {
    const team = await this.findOne(id);
    await this.checkName(dto.name, id);

    // PUT reemplaza todo, lo que no venga queda en null / valor por defecto
    team.name = dto.name;
    team.base = dto.base ?? null;
    team.founded_year = dto.founded_year ?? null;
    team.active = dto.active ?? true;

    return this.teamRepository.save(team);
  }

  async assignCharacters(id: number, characterIds: number[]) {
    const team = await this.findOne(id);
    await this.checkCharactersExist(characterIds);
    if (!team.active) {
      throw new BadRequestException(
        'No se pueden asignar personajes a un equipo inactivo',
      );
    }

    // si alguno ya tenia otro equipo, queda reasignado a este
    await this.characterRepository.update(
      { id: In(characterIds) },
      { team_id: id },
    );
    return { ...team, characters: await this.findCharacters(id) };
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    const total = await this.characterRepository.count({
      where: { team_id: id },
    });
    if (total > 0) {
      throw new ConflictException(
        `El equipo tiene ${total} personaje(s) asociados. Para cerrarlo se debe desactivar con PUT (active: false)`,
      );
    }
    await this.teamRepository.remove(team);
    return { message: `Equipo ${id} eliminado` };
  }

  private async checkCharactersExist(ids: number[]) {
    const uniqueIds = [...new Set(ids)];
    const found = await this.characterRepository.find({
      select: { id: true },
      where: { id: In(uniqueIds) },
    });
    const foundIds = found.map((c) => c.id);
    const missing = uniqueIds.filter((charId) => !foundIds.includes(charId));
    if (missing.length) {
      throw new NotFoundException(
        `No existen los personajes con id: ${missing.join(', ')}`,
      );
    }
  }

  private async checkName(name: string, id?: number) {
    const existing = await this.teamRepository.findOne({ where: { name } });
    if (existing && existing.id !== id) {
      throw new ConflictException(`Ya existe un equipo con el nombre ${name}`);
    }
  }
}
