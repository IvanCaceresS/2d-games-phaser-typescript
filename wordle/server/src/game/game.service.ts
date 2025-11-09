import { Injectable } from '@nestjs/common';
import { WordService } from '../word/word.service';
import { CheckWordDto } from './dto/check-word.dto';

// Define la estructura de la respuesta
export interface LetterStatus {
  letter: string;
  status: 'green' | 'yellow' | 'gray';
}

export type CheckWordResponse =
  | { status: 'ok'; result: LetterStatus[] }
  | { status: 'invalid_word' };

@Injectable()
export class GameService {
  constructor(private readonly wordService: WordService) {}

  async checkWord(checkWordDto: CheckWordDto): Promise<CheckWordResponse> {
    const { guess, difficulty } = checkWordDto;
    const guessUpper = guess.toUpperCase();

    const isValid = await this.wordService.isValidWord(guessUpper);
    if (!isValid) {
      // 4. DEVOLVEMOS UN JSON VÁLIDO DE ERROR
      return { status: 'invalid_word' };
    }

    const wordOfTheDay = await this.wordService.getWordOfTheDay(difficulty);

    if (!wordOfTheDay) {
      throw new Error('No hay palabra del día configurada para esta dificultad');
    }

    const solution = wordOfTheDay.text.toUpperCase();
    
    // --- INICIO DE LA LÓGICA CORREGIDA ---

    // 1. Objeto para contar las letras de la solución
    const solutionLetterCounts: { [key: string]: number } = {};
    for (const letter of solution) {
      solutionLetterCounts[letter] = (solutionLetterCounts[letter] || 0) + 1;
    }

    // 2. Inicializar el resultado (todo gris por defecto)
    const result: LetterStatus[] = guessUpper.split('').map(letter => ({
      letter,
      status: 'gray',
    }));

    // 3. PRIMERA PASADA: Marcar Verdes (Green)
    for (let i = 0; i < solution.length; i++) {
      const letter = guessUpper[i];
      if (solution[i] === letter) {
        result[i].status = 'green';
        // Descontar la letra para que no cuente como amarilla
        solutionLetterCounts[letter]--;
      }
    }

    // 4. SEGUNDA PASADA: Marcar Amarillos (Yellow)
    for (let i = 0; i < solution.length; i++) {
      // Si ya es verde, saltar
      if (result[i].status === 'green') {
        continue;
      }
      
      const letter = guessUpper[i];

      // Si la letra existe en la solución Y AÚN QUEDAN disponibles (count > 0)
      if (solution.includes(letter) && solutionLetterCounts[letter] > 0) {
        result[i].status = 'yellow';
        // Descontar la letra usada
        solutionLetterCounts[letter]--;
      }
    }
    
    // --- FIN DE LA LÓGICA CORREGIDA ---

    return { status: 'ok', result };
  }
}