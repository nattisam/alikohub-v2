import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth';
import { PostsModule } from './posts/posts.module';
import { PromotionRequestsModule } from './promotion-requests/promotion-requests.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        PostsModule,
        PromotionRequestsModule,
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule { }