import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

export type AuthenticatedUser = {
    firebaseId: string;
    globalRole: "USER" | "ADMIN";
}

@Injectable()
export class ContechProfileGuard implements CanActivate {
    constructor(private prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const data = context.switchToRpc().getData();

        const user: AuthenticatedUser = data.user;

        if (!user || !user.firebaseId) {
            throw new RpcException('User identity not provided in payload');
        }

        let profile = await this.prisma.contechProfile.findUnique({
            where: {userId: user.firebaseId},
        });

        if (!profile) {
            const roleToAssign = user.globalRole === 'ADMIN' ? "ADMIN" : "CLIENT";
            profile = await this.prisma.contechProfile.create({
                data: {userId: user.firebaseId, role: roleToAssign},
            }); 
        }

        data.contechProfile = profile;

        return true;
    }
}