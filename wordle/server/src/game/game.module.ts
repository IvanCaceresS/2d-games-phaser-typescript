import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { WordModule } from '../word/word.module';

@Module({
  imports: [WordModule],
  providers: [GameService],
  controllers: [GameController]
})
export class GameModule {}
