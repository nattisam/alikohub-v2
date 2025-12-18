import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { RbacController } from './rbac.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from './roles/roles.guard';
import { Argon2Service } from './argon2.service';
import { FirebaseAuthGuard } from './guard/firebase_auth.guard';

@Module({
	imports: [UserModule, FirebaseModule, PrismaModule],
	controllers: [AuthController, RbacController],
	providers: [AuthService, RolesGuard, Argon2Service, FirebaseAuthGuard],
	exports: [RolesGuard],
})
export class AuthModule {}
