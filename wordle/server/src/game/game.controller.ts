import { Controller, Post, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { CheckWordDto } from './dto/check-word.dto';

@Controller('api/game') // Ruta base: http://...:3002/api/game
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('check') // Ruta completa: POST /api/game/check
  checkWord(@Body() checkWordDto: CheckWordDto) {
    return this.gameService.checkWord(checkWordDto);
  }
}