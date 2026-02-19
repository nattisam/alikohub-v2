import { Module } from '@nestjs/common';
import { ProgressAndAnalyticsController } from './progress-and-analytics.controller';

@Module({
  controllers: [ProgressAndAnalyticsController]
})
export class ProgressAndAnalyticsModule {}
