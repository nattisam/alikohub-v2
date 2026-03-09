import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateRsvpDto } from "./dto/create-rsvp.dto";
import { AuthenticatedUser, UserService } from "../user/user.service";
import { EventsRole } from "../generated/client";

@Injectable()
export class RsvpsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(createRsvpDto: CreateRsvpDto) {
    const event = await this.prisma.post.findUnique({
      where: { id: createRsvpDto.eventId },
    });

    if (!event) throw new NotFoundException("Event not found");

    return this.prisma.rSVP.create({
      data: createRsvpDto,
    });
  }

  async findAllForMyEvents(user: AuthenticatedUser) {
    const profile = await this.userService.getProfileAndSync(user);
    if (!profile) throw new ForbiddenException("No events profile found.");

    let where: any = {};
    if (profile.role !== EventsRole.ADMIN) {
      where = { event: { authorId: user.firebaseId } };
    }

    return this.prisma.rSVP.findMany({
      where,
      include: {
        event: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async remove(id: string, user: AuthenticatedUser) {
    const rsvp = await this.prisma.rSVP.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!rsvp) throw new NotFoundException("RSVP not found");

    const profile = await this.userService.getProfileAndSync(user);
    if (!profile || (profile.role !== EventsRole.ADMIN && rsvp.event.authorId !== user.firebaseId)) {
      throw new ForbiddenException("Permission denied.");
    }

    return this.prisma.rSVP.delete({
      where: { id },
    });
  }
}
