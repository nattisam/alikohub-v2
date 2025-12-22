import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationsService {
    constructor(private prisma: PrismaService) { }

    async create(eventId: string, createRegistrationDto: CreateRegistrationDto) {
        // Check if registration already exists for this email and event
        const existingRegistration = await this.prisma.registration.findFirst({
            where: {
                eventId,
                email: createRegistrationDto.email,
            },
        });

        if (existingRegistration) {
            return {
                message: 'You are already registered for this event',
                registration_id: existingRegistration.id,
            };
        }

        const registration = await this.prisma.registration.create({
            data: {
                ...createRegistrationDto,
                eventId,
            },
        });

        return {
            message: 'Registration successful',
            registration_id: registration.id,
        };
    }

    async findAll(eventId: string) {
        return this.prisma.registration.findMany({
            where: { eventId },
            orderBy: {
                registeredAt: 'desc',
            },
        });
    }

    async remove(eventId: string, registrationId: string) {
        // Verify that the registration belongs to the specified event
        const registration = await this.prisma.registration.findUnique({
            where: { id: registrationId },
        });

        if (!registration || registration.eventId !== eventId) {
            return null;
        }

        return this.prisma.registration.delete({
            where: { id: registrationId },
        });
    }
}