import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryColumn({ name: 'vehicle_id', length: 64 })
  vehicleId: string;

  @Column({ length: 17, unique: true, nullable: true })
  vin: string;

  @Column({
    name: 'battery_capacity_kwh',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  batteryCapacityKwh: number;

  @Column({ length: 100, nullable: true })
  model: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
