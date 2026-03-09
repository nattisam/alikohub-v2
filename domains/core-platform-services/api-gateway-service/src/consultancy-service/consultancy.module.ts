import { Module } from '@nestjs/common';
import { ConsultancyController } from './consultancy.controller';

@Module({
  controllers: [ConsultancyController],
})
export class ConsultancyServiceModule {}
