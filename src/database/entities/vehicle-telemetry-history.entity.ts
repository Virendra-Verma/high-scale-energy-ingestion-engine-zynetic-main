import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';

@Entity('vehicle_telemetry_history')
@Index('idx_vehicle_history_timerange', ['timestamp', 'vehicleId'])
export class VehicleTelemetryHistory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'vehicle_id', length: 64 })
  vehicleId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  soc: number;

  @Column({ name: 'kwh_delivered_dc', type: 'decimal', precision: 12, scale: 4 })
  kwhDeliveredDc: number;

  @Column({ name: 'battery_temp', type: 'decimal', precision: 5, scale: 2 })
  batteryTemp: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ name: 'ingested_at', type: 'timestamptz', default: () => 'NOW()' })
  ingestedAt: Date;
}
