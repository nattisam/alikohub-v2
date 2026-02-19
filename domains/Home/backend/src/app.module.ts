import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController, HealthController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [],
})
export class AppModule {}
