import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vehicle_live_state')
export class VehicleLiveState {
  @PrimaryColumn({ name: 'vehicle_id', length: 64 })
  vehicleId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  soc: number;

  @Column({ name: 'kwh_delivered_dc', type: 'decimal', precision: 12, scale: 4 })
  kwhDeliveredDc: number;

  @Column({ name: 'battery_temp', type: 'decimal', precision: 5, scale: 2 })
  batteryTemp: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
