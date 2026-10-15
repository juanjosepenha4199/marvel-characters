import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CharacterStatus } from '../character.entity';

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  real_name!: string;

  @IsString()
  @IsNotEmpty()
  alias!: string;

  @IsString()
  @IsNotEmpty()
  main_power!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  power_level!: number;

  @IsOptional()
  @IsEnum(CharacterStatus)
  status?: CharacterStatus;

  @IsOptional()
  @IsBoolean()
  is_villain?: boolean;

  @IsOptional()
  @IsInt()
  team_id?: number;
}
