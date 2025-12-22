import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ApplicationModule,
    AuthModule,
    FirebaseModule,
    PrismaModule,
    UserModule,
  ],
})
export class AppModule {}
