import { Module } from '@nestjs/common';
import { ConTechProfileController } from './contech-profile.controller';

@Module({
    controllers: [ConTechProfileController]
})
export class ConTechProfileModule { }