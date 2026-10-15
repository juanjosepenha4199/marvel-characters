import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from '../teams/team.entity';

export enum CharacterStatus {
  ACTIVE = 'ACTIVE',
  INJURED = 'INJURED',
  MISSING = 'MISSING',
  RETIRED = 'RETIRED',
}

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  real_name!: string;

  @Column({ unique: true })
  alias!: string;

  @Column()
  main_power!: string;

  @Column()
  power_level!: number;

  @Column({ type: 'varchar', default: CharacterStatus.ACTIVE })
  status!: CharacterStatus;

  @Column({ default: false })
  is_villain!: boolean;

  @Column({ type: 'int', nullable: true })
  team_id!: number | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Team, (team) => team.characters)
  @JoinColumn({ name: 'team_id' })
  team!: Team | null;
}
