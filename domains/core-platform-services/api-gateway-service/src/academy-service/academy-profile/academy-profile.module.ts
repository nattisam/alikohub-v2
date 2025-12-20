import { Module } from '@nestjs/common';
import { AcademyProfileController } from './academy-profile.controller';

@Module({
    controllers: [AcademyProfileController]
})
export class AcademyProfileModule { }