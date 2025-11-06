import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { CreateScoreDto } from './dto/create-score.dto';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
  ) {}
  // INICIO LÓGICA PARA CREAR O ACTUALIZAR PUNTUACIÓN ---
  async create(createScoreDto: CreateScoreDto): Promise<Score> {
    const { name, score } = createScoreDto;
    const normalizedName = name.toUpperCase();

    const existingScore = await this.scoreRepository.findOne({
      where: { name: normalizedName },
    });

    if (existingScore) {
      if (score > existingScore.score) {
        existingScore.score = score;
        existingScore.createdAt = new Date();
        return this.scoreRepository.save(existingScore);
      } else {
        return existingScore;
      }
    } else {
      const newScore = this.scoreRepository.create({
        name: normalizedName, // <-- CAMBIADO
        score: score,
      });
      return this.scoreRepository.save(newScore);
    }
  }

  findAll(): Promise<Score[]> {
    return this.scoreRepository.find({
      order: {
        score: 'DESC',
      },
      take: 10,
    });
  }
  // FIN LÓGICA PARA CREAR O ACTUALIZAR PUNTUACIÓN ---

}