import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  meterId: string;

  @IsString()
  @IsNotEmpty()
  vehicleId: string;
}
