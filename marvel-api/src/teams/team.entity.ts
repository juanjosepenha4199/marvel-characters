import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Character } from '../characters/character.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  base!: string | null;

  @Column({ type: 'int', nullable: true })
  founded_year!: number | null;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Character, (character) => character.team)
  characters!: Character[];
}
