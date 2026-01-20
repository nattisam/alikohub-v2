import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { winstonLogger } from '../logger';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async create(createEventDto: CreateEventDto) {
        // Log the incoming DTO for debugging
        winstonLogger.info('Creating event with DTO: ' + JSON.stringify(createEventDto, null, 2));
        
        // Ensure all required fields are present and not empty
        if (!createEventDto.title || !createEventDto.description || !createEventDto.date || !createEventDto.time || !createEventDto.location) {
            winstonLogger.error('DTO has empty required fields. Received: ' + JSON.stringify(createEventDto));
            throw new Error('Missing required fields for event creation');
        }
        
        return this.prisma.event.create({
            data: {
                title: createEventDto.title,
                description: createEventDto.description,
                date: createEventDto.date,
                time: createEventDto.time,
                location: createEventDto.location,
                bannerUrl: (createEventDto as any).bannerUrl,
            },
        });
    }

    async findAll() {
        return this.prisma.event.findMany({
            orderBy: {
                date: 'asc',
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.event.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateEventDto: UpdateEventDto) {
        // Build the data object only with provided fields
        const data: any = {};
        if (updateEventDto.title !== undefined) data.title = updateEventDto.title;
        if (updateEventDto.description !== undefined) data.description = updateEventDto.description;
        if (updateEventDto.date !== undefined) data.date = updateEventDto.date;
        if (updateEventDto.time !== undefined) data.time = updateEventDto.time;
        if (updateEventDto.location !== undefined) data.location = updateEventDto.location;
        if ((updateEventDto as any).bannerUrl !== undefined) data.bannerUrl = (updateEventDto as any).bannerUrl;
        
        return this.prisma.event.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.event.delete({
            where: { id },
        });
    }
}