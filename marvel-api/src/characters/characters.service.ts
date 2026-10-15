import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character, CharacterStatus } from './character.entity';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  findAll(status?: CharacterStatus, teamId?: number) {
    const where: { status?: CharacterStatus; team_id?: number } = {};
    if (status) where.status = status;
    if (teamId) where.team_id = teamId;

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
    const character = this.characterRepository.create(dto);
    return this.characterRepository.save(character);
  }

  async update(id: number, dto: CreateCharacterDto) {
    const character = await this.findOne(id);
    await this.checkAlias(dto.alias, id);

    character.real_name = dto.real_name;
    character.alias = dto.alias;
    character.main_power = dto.main_power;
    character.power_level = dto.power_level;
    character.status = dto.status ?? CharacterStatus.ACTIVE;
    character.is_villain = dto.is_villain ?? false;
    character.team_id = dto.team_id ?? null;
    // si no se quita, typeorm usa la relacion vieja en vez del team_id nuevo
    character.team = null;

    await this.characterRepository.save(character);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: CharacterStatus) {
    const character = await this.findOne(id);
    character.status = status;
    return this.characterRepository.save(character);
  }

  async remove(id: number) {
    const character = await this.findOne(id);
    await this.characterRepository.remove(character);
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
