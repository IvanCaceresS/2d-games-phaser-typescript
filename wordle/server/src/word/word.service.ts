import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './word.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WordService implements OnModuleInit {
  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) {}

  // Esto se ejecuta cuando el módulo se carga
  async onModuleInit() {
    const count = await this.wordRepository.count();
    if (count === 0) {
      console.log('Base de datos vacía, poblando palabras...');
      await this.seedDatabase();
    }
  }

  private async seedDatabase() {
    try {
      const seedPath = path.join(process.cwd(), 'src', 'seed');

      // Lee y carga palabras de 5 letras
      const p5 = fs.readFileSync(path.join(seedPath, 'palabras_5.txt'), 'utf8').split('\n');
      await this.saveWords(p5, 5);

      // Lee y carga palabras de 7 letras
      const p7 = fs.readFileSync(path.join(seedPath, 'palabras_7.txt'), 'utf8').split('\n');
      await this.saveWords(p7, 7);

      // Lee y carga palabras de 9 letras
      const p9 = fs.readFileSync(path.join(seedPath, 'palabras_9.txt'), 'utf8').split('\n');
      await this.saveWords(p9, 9);

      console.log('Poblado de base de datos completado.');
      console.log('Se cargaron %d palabras de 5 letras, %d palabras de 7 letras y %d palabras de 9 letras.', p5.length, p7.length, p9.length);
    } catch (error) {
      console.error('Error al poblar la base de datos:', error);
    }
  }

  private async saveWords(words: string[], length: number) {
    const wordEntities = words
      .map(w => w.trim().toUpperCase())
      .filter(w => w.length === length)
      .map(w => this.wordRepository.create({ text: w, length: length }));

    await this.wordRepository.save(wordEntities);
  }

  // Función para obtener la palabra del día (simple)
  async getWordOfTheDay(length: number): Promise<Word | null> {
    const count = await this.wordRepository.count({ where: { length } });
    // Cantidad de palabras disponibles de la longitud dada
    console.log(`Cantidad de palabras de longitud ${length}: ${count}`);
    if (count === 0) return null;

    // Estrategia simple: usa el día del año para elegir la palabra
    // Esto asegura que todos los jugadores tengan la misma palabra
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = (dayOfYear % count); // skip = index, take = 1

    const word = await this.wordRepository.find({
        where: { length },
        skip: index,
        take: 1,
    });
    return word.length > 0 ? word[0] : null;
  }

  async isValidWord(text: string): Promise<boolean> {
    const upperText = text.toUpperCase();
    
    // Busca la palabra en el repositorio
    const word = await this.wordRepository.findOne({ 
      where: { text: upperText } 
    });
    
    // Devuelve true si la palabra se encontró, false si no
    return !!word;
  }
}