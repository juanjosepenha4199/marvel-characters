import { IsEnum } from 'class-validator';
import { CharacterStatus } from '../character.entity';

export class UpdateStatusDto {
  @IsEnum(CharacterStatus)
  status!: CharacterStatus;
}
