import { Module } from '@nestjs/common';
import { CohortController } from './cohort.controller';

@Module({
  controllers: [CohortController]
})
export class CohortModule {}
