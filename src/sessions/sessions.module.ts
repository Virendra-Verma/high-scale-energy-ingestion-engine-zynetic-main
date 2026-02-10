import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './controllers/sessions.controller';
import { SessionsService } from './services/sessions.service';
import { ChargingSession, Meter, Vehicle } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ChargingSession, Meter, Vehicle])],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
