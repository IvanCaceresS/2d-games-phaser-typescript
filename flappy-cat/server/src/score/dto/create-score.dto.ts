import { IsInt, IsNotEmpty, Length, Max, Matches } from 'class-validator';

export class CreateScoreDto {
  
  @IsNotEmpty()
  @Length(3, 5)
  @Matches(/^[A-Z0-9Ñ]+$/i, {
    message: 'El nombre solo puede contener letras (A-Z, Ñ) y números (0-9)',
  })
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Max(99999)
  score: number;
}