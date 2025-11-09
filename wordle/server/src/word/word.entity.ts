import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 9 })
  @Index()
  text: string;

  @Column()
  @Index()
  length: number;
}