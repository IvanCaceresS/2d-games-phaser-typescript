import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  create(@Body(new ValidationPipe()) createScoreDto: CreateScoreDto) {
    return this.scoreService.create(createScoreDto);
  }

  @Get()
  findAll() {
    return this.scoreService.findAll();
  }
}