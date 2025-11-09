import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { WordService } from './word.service';

@Module({
  imports: [TypeOrmModule.forFeature([Word])], // ¡Importante!
  providers: [WordService],
  exports: [WordService], // Exportamos el servicio para usarlo en el módulo de Juego
})
export class WordModule {}