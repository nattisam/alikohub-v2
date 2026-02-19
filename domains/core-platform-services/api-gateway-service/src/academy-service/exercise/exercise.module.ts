import { Module } from '@nestjs/common';
import { ExercisesController } from './exercise.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ACADEMY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ACADEMY_SERVICE_HOST || '127.0.0.1',
          port: parseInt(process.env.ACADEMY_SERVICE_PORT || '3005', 10) || 3005,
        },
      },
    ]),
  ],
  controllers: [ExercisesController],
})
export class ExercisesModule {}
