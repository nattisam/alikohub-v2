import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Req,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { AuthGuard } from '../common/guard/firebase_auth.guard';
import { RoleGuard } from '../common/roles/roles.guard';
import { Roles } from '../common/roles/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('consultancy')
@UseGuards(AuthGuard, RoleGuard)
export class ConsultancyController {
  constructor(
    @Inject('CONSULTANCY_SERVICE') private readonly client: ClientProxy,
  ) {}

  // --- Profile ---
  @Get('profiles/me')
  async getMyProfile(@Req() req: Request) {
    return firstValueFrom(
      this.client.send({ cmd: 'get_profile' }, { userId: req.user!.firebaseId }),
    );
  }

  @Patch('profiles/me')
  async updateMyProfile(@Req() req: Request, @Body() data: Record<string, unknown>) {
    return firstValueFrom(
      this.client.send({ cmd: 'update_profile' }, { userId: req.user!.firebaseId, ...data }),
    );
  }

  // --- Availability ---
  @Public()
  @Get('availability/rules')
  async getAvailabilityRules() {
    return firstValueFrom(
      this.client.send({ cmd: 'get_availability_rules' }, {}),
    );
  }

  @Post('availability/rules')
  @Roles('ADMIN')
  async createAvailabilityRule(@Req() req: Request, @Body() data: Record<string, unknown>) {
    return firstValueFrom(
      this.client.send({ cmd: 'create_availability_rule' }, { user: req.user!, ...data }),
    );
  }

  // --- Bookings ---
  @Get('bookings')
  @Roles('ADMIN')
  async getAllBookings() {
    return firstValueFrom(
      this.client.send({ cmd: 'get_all_bookings' }, {}),
    );
  }

  @Post('bookings')
  async createBooking(@Req() req: Request, @Body() data: Record<string, unknown>) {
    return firstValueFrom(
      this.client.send({ cmd: 'create_booking' }, { userId: req.user!.firebaseId, ...data }),
    );
  }

  @Get('bookings/me')
  async getMyBookings(@Req() req: Request) {
    return firstValueFrom(
      this.client.send({ cmd: 'get_user_bookings' }, { userId: req.user!.firebaseId }),
    );
  }

  // --- Applications ---
  @Post('applications')
  async createApplication(@Req() req: Request, @Body() data: Record<string, unknown>) {
    return firstValueFrom(
      this.client.send({ cmd: 'create_application' }, { userId: req.user!.firebaseId, ...data }),
    );
  }

  @Get('applications/me')
  async getMyApplications(@Req() req: Request) {
    return firstValueFrom(
      this.client.send({ cmd: 'get_user_applications' }, { userId: req.user!.firebaseId }),
    );
  }

  @Get('applications/:id')
  async getApplication(@Param('id') id: string, @Req() req: Request) {
    return firstValueFrom(
      this.client.send({ cmd: 'get_application' }, { id, user: req.user! }),
    );
  }

  @Patch('applications/:id/status')
  @Roles('ADMIN')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() data: Record<string, unknown>,
  ) {
    return firstValueFrom(
      this.client.send({ cmd: 'update_application_status' }, {
        id,
        changedBy: req.user!.firebaseId,
        ...data,
      }),
    );
  }

  // --- CMS ---
  @Public()
  @Get('cms/pages')
  async getPages() {
    return firstValueFrom(this.client.send({ cmd: 'get_pages' }, {}));
  }

  @Public()
  @Get('cms/pages/:slug')
  async getPageBySlug(@Param('slug') slug: string) {
    return firstValueFrom(this.client.send({ cmd: 'get_page_by_slug' }, { slug }));
  }

  @Public()
  @Get('cms/resources')
  async getResources(@Query('type') type: string) {
    return firstValueFrom(this.client.send({ cmd: 'get_resources' }, { type }));
  }

  @Public()
  @Get('cms/webinars')
  async getWebinars() {
    return firstValueFrom(this.client.send({ cmd: 'get_webinars' }, {}));
  }

  @Public()
  @Get('cms/testimonials')
  async getTestimonials() {
    return firstValueFrom(this.client.send({ cmd: 'get_testimonials' }, {}));
  }

  // --- Contact ---
  @Post('contact')
  async createContactSubmission(@Req() req: Request, @Body() data: Record<string, unknown>) {
    return firstValueFrom(
      this.client.send({ cmd: 'create_contact_submission' }, {
        userId: req.user!.firebaseId,
        ...data,
      }),
    );
  }
}
