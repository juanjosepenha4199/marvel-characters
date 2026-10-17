import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character, CharacterStatus } from './character.entity';
import { Team } from '../teams/team.entity';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  findAll(status?: CharacterStatus, teamId?: number) {
    const where: { status?: CharacterStatus; team_id?: number } = {};
    if (status) where.status = status;
    if (teamId !== undefined) where.team_id = teamId;

    return this.characterRepository.find({ where, order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const character = await this.characterRepository.findOne({
      where: { id },
      relations: { team: true },
    });
    if (!character) {
      throw new NotFoundException(`No existe el personaje con id ${id}`);
    }
    return character;
  }

  async create(dto: CreateCharacterDto) {
    await this.checkAlias(dto.alias);
    if (dto.team_id != null) await this.checkTeam(dto.team_id);

    const character = await this.characterRepository.save(
      this.characterRepository.create(dto),
    );
    return this.findOne(character.id);
  }

  async update(id: number, dto: CreateCharacterDto) {
    const character = await this.findOne(id);
    await this.checkAlias(dto.alias, id);
    if (dto.team_id != null) await this.checkTeam(dto.team_id);

    const newStatus = dto.status ?? CharacterStatus.ACTIVE;
    this.checkStatusChange(character.status, newStatus);

    character.real_name = dto.real_name;
    character.alias = dto.alias;
    character.main_power = dto.main_power;
    character.power_level = dto.power_level;
    character.status = newStatus;
    character.is_villain = dto.is_villain ?? false;
    character.team_id = dto.team_id ?? null;
    // si no se quita, typeorm usa la relacion vieja en vez del team_id nuevo
    character.team = null;

    await this.characterRepository.save(character);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: CharacterStatus) {
    const character = await this.findOne(id);
    this.checkStatusChange(character.status, status);

    await this.characterRepository.update(id, { status });
    return this.findOne(id);
  }

  async remove(id: number) {
    const character = await this.findOne(id);
    await this.characterRepository.remove(character);
    return { message: `Personaje ${id} eliminado` };
  }

  private async checkTeam(teamId: number) {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException(`No existe el equipo con id ${teamId}`);
    }
    if (!team.active) {
      throw new BadRequestException(
        `El equipo ${team.name} esta inactivo, no se le pueden asignar personajes`,
      );
    }
  }

  // un personaje retirado no puede quedar herido de una, primero vuelve a ACTIVE
  private checkStatusChange(current: CharacterStatus, next: CharacterStatus) {
    if (
      current === CharacterStatus.RETIRED &&
      next === CharacterStatus.INJURED
    ) {
      throw new BadRequestException(
        'Un personaje RETIRED no puede pasar directamente a INJURED',
      );
    }
  }

  private async checkAlias(alias: string, id?: number) {
    const existing = await this.characterRepository.findOne({
      where: { alias },
    });
    if (existing && existing.id !== id) {
      throw new ConflictException(
        `Ya existe un personaje con el alias ${alias}`,
      );
    }
  }
}
