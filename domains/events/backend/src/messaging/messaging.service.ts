import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { SendMessageDto, TargetAudience } from "./dto/send-message.dto";

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(id: string, dto: SendMessageDto, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        registrations: true,
        rsvps: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    }

    // Determine recipients
    let recipients: string[] = [];

    if (post.type === "EVENT") {
      if (dto.targetAudience === TargetAudience.ALL) {
        recipients = post.registrations.map(r => r.attendeeEmail);
      } else if (dto.targetAudience === TargetAudience.CHECKED_IN) {
        recipients = post.registrations.filter(r => r.isCheckedIn).map(r => r.attendeeEmail);
      } else if (dto.targetAudience === TargetAudience.NOT_CHECKED_IN) {
        recipients = post.registrations.filter(r => !r.isCheckedIn).map(r => r.attendeeEmail);
      }
    } else if (post.type === "SOCIAL_EVENT") {
      if (dto.targetAudience === TargetAudience.ALL) {
        recipients = post.rsvps.map(r => r.guestEmail);
      } else if (dto.targetAudience === TargetAudience.RSVP_YES) {
        recipients = post.rsvps.filter(r => r.response === "yes").map(r => r.guestEmail);
      } else if (dto.targetAudience === TargetAudience.RSVP_MAYBE) {
        recipients = post.rsvps.filter(r => r.response === "maybe").map(r => r.guestEmail);
      }
    }

    // Remove duplicates
    recipients = Array.from(new Set(recipients));

    this.logger.log(`Dispatching message: "${dto.subject}" to ${recipients.length} recipients for event ${post.title}`);
    
    // Here logic would be to call a Mailer service or Notification service via RabbitMQ
    // For now, we simulate sending:
    return {
      success: true,
      sentCount: recipients.length,
      recipients: recipients.slice(0, 5), // return a sample
      message: `Successfully dispatched to ${recipients.length} recipients.`,
    };
  }

  async getRecentStats() {
    // Mock stats for the dashboard
    return {
      totalSent: 125,
      deliveryRate: 98.4,
      openRate: 64.2,
      lastThirtyDays: [
        { date: "2024-03-01", count: 12 },
        { date: "2024-03-05", count: 25 },
        { date: "2024-03-10", count: 8 },
        // ...
      ],
    };
  }
}
