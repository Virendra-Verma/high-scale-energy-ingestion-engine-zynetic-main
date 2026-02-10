import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('meter_live_state')
export class MeterLiveState {
  @PrimaryColumn({ name: 'meter_id', length: 64 })
  meterId: string;

  @Column({ name: 'kwh_consumed_ac', type: 'decimal', precision: 12, scale: 4 })
  kwhConsumedAc: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  voltage: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
