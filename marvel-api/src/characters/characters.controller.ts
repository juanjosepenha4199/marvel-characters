import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharacterStatus } from './character.entity';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll(
    @Query('status') status?: CharacterStatus,
    @Query('teamId') teamId?: string,
  ) {
    if (status && !Object.values(CharacterStatus).includes(status)) {
      throw new BadRequestException('El status no es valido');
    }
    return this.charactersService.findAll(
      status,
      teamId ? Number(teamId) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCharacterDto) {
    return this.charactersService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCharacterDto,
  ) {
    return this.charactersService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.charactersService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.remove(id);
  }
}
