import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
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
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: { characters: true },
    });
    if (!team) {
      throw new NotFoundException(`No existe el equipo con id ${id}`);
    }
    return team.characters;
  }

  async create(dto: CreateTeamDto) {
    await this.checkName(dto.name);
    const team = this.teamRepository.create(dto);
    return this.teamRepository.save(team);
  }

  async update(id: number, dto: CreateTeamDto) {
    const team = await this.findOne(id);
    await this.checkName(dto.name, id);

    // PUT reemplaza todo, lo que no venga queda en null / valor por defecto
    team.name = dto.name;
    team.base = dto.base ?? null;
    team.founded_year = dto.founded_year ?? null;
    team.active = dto.active ?? true;

    return this.teamRepository.save(team);
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }

  private async checkName(name: string, id?: number) {
    const existing = await this.teamRepository.findOne({ where: { name } });
    if (existing && existing.id !== id) {
      throw new ConflictException(`Ya existe un equipo con el nombre ${name}`);
    }
  }
}
