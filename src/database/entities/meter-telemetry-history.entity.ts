import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('meter_telemetry_history')
@Index('idx_meter_history_timerange', ['timestamp', 'meterId'])
export class MeterTelemetryHistory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'meter_id', length: 64 })
  meterId: string;

  @Column({ name: 'kwh_consumed_ac', type: 'decimal', precision: 12, scale: 4 })
  kwhConsumedAc: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  voltage: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ name: 'ingested_at', type: 'timestamptz', default: () => 'NOW()' })
  ingestedAt: Date;
}
