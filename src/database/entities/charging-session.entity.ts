import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Meter } from './meter.entity';
import { Vehicle } from './vehicle.entity';

@Entity('charging_sessions')
@Index('idx_charging_sessions_active', ['meterId', 'vehicleId'], { where: 'is_active = TRUE' })
@Index('idx_charging_sessions_timerange', ['startedAt', 'endedAt'])
@Index('idx_charging_sessions_vehicle', ['vehicleId', 'startedAt'])
export class ChargingSession {
  @PrimaryGeneratedColumn('uuid', { name: 'session_id' })
  sessionId: string;

  @Column({ name: 'meter_id', length: 64 })
  meterId: string;

  @Column({ name: 'vehicle_id', length: 64 })
  vehicleId: string;

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamptz', nullable: true })
  endedAt: Date | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Meter)
  @JoinColumn({ name: 'meter_id' })
  meter: Meter;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;
}
