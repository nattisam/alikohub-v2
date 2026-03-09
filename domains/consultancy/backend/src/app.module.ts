import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { BookingModule } from './booking/booking.module';
import { ApplicationModule } from './application/application.module';
import { CmsModule } from './cms/cms.module';
import { ProfileModule } from './profile/profile.module';
import { AvailabilityModule } from './availability/availability.module';
import { ContactModule } from './contact/contact.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    BookingModule,
    ApplicationModule,
    CmsModule,
    ProfileModule,
    AvailabilityModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
