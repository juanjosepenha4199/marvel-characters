import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  base?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  founded_year?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  // solo aplica en el POST, para asignar personajes al crear el equipo
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  characterIds?: number[];
}
