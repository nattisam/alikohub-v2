import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/client';
import { generateUniqueCode } from '../common/utils/code-generator.util';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Prisma.BookingCreateInput, 'bookingCode'>) {
    const bookingCode = await generateUniqueCode(
      this.prisma,
      this.prisma.booking,
      'bookingCode',
      'BK-ALC-',
    );
    return this.prisma.booking.create({
      data: { ...data, bookingCode },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany();
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException(`Booking ${id} not found`);
    return booking;
  }

  async findByUser(userId: string) {
    return this.prisma.booking.findMany({ where: { userId } });
  }

  async update(id: string, data: Prisma.BookingUpdateInput) {
    await this.findOne(id); // Ensure it exists
    return this.prisma.booking.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.booking.delete({ where: { id } });
  }
}
