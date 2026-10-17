import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseEnumPipe,
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
    @Query('status', new ParseEnumPipe(CharacterStatus, { optional: true }))
    status?: CharacterStatus,
    @Query('teamId', new ParseIntPipe({ optional: true })) teamId?: number,
  ) {
    return this.charactersService.findAll(status, teamId);
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
