import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('meters')
export class Meter {
  @PrimaryColumn({ name: 'meter_id', length: 64 })
  meterId: string;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({
    name: 'capacity_kw',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  capacityKw: number;

  @Column({ name: 'installed_at', type: 'timestamptz', default: () => 'NOW()' })
  installedAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
