import { OmitType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';

// el PUT recibe lo mismo que el POST menos characterIds (para eso esta el PATCH)
export class UpdateTeamDto extends OmitType(CreateTeamDto, [
  'characterIds',
] as const) {}
