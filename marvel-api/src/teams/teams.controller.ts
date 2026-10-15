import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Get(':id/characters')
  findCharacters(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findCharacters(id);
  }

  @Post()
  create(@Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateTeamDto) {
    return this.teamsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.remove(id);
  }
}
