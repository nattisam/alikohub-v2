import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateRegistrationDto } from "./dto/create-registration.dto";
import { AuthenticatedUser, UserService } from "../user/user.service";
import { EventsRole } from "../generated/client";

@Injectable()
export class RegistrationsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto, user?: AuthenticatedUser) {
    const event = await this.prisma.post.findUnique({
      where: { id: createRegistrationDto.eventId },
    });

    if (!event) throw new NotFoundException("Event not found");

    return this.prisma.registration.create({
      data: {
        ...createRegistrationDto,
        userId: user?.firebaseId || null,
      },
    });
  }

  async findAllForMyEvents(user: AuthenticatedUser) {
    const profile = await this.userService.getProfileAndSync(user);
    if (!profile) throw new ForbiddenException("No events profile found.");

    let where: any = {};
    if (profile.role !== EventsRole.ADMIN) {
      where = { event: { authorId: user.firebaseId } };
    }

    return this.prisma.registration.findMany({
      where,
      include: {
        event: {
          select: { title: true }
        },
        ticket: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async toggleCheckIn(id: string, user: AuthenticatedUser) {
    const registration = await this.prisma.registration.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!registration) throw new NotFoundException("Registration not found");

    const profile = await this.userService.getProfileAndSync(user);
    if (!profile || (profile.role !== EventsRole.ADMIN && registration.event.authorId !== user.firebaseId)) {
      throw new ForbiddenException("Permission denied.");
    }

    return this.prisma.registration.update({
      where: { id },
      data: {
        isCheckedIn: !registration.isCheckedIn,
        checkedInAt: !registration.isCheckedIn ? new Date() : null,
      },
    });
  }
}
