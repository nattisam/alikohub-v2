import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth';
import { PostsModule } from './posts/posts.module';
import { PromotionRequestsModule } from './promotion-requests/promotion-requests.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        PostsModule,
        PromotionRequestsModule,
        UserModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }