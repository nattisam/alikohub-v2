import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './modules/auth/auth.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';

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
