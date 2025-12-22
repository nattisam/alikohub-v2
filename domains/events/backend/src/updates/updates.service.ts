import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';

@Injectable()
export class UpdatesService {
    constructor(private prisma: PrismaService) { }

    async create(createUpdateDto: CreateUpdateDto) {
        return this.prisma.update.create({
            data: createUpdateDto,
        });
    }

    async findAll() {
        return this.prisma.update.findMany({
            orderBy: {
                postedAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.update.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateUpdateDto: UpdateUpdateDto) {
        return this.prisma.update.update({
            where: { id },
            data: updateUpdateDto,
        });
    }

    async remove(id: string) {
        return this.prisma.update.delete({
            where: { id },
        });
    }
}