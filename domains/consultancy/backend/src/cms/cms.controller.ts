import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CmsService } from './cms.service';
import { Prisma } from '../generated/client';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  resolvePayload,
  resolveParam,
} from '../common/utils/payload-resolver.util';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  // --- Pages ---
  @MessagePattern({ cmd: 'create_page' })
  @Post('pages')
  createPage(
    @Body() data: Prisma.PageCreateInput,
    @Payload() payload: Prisma.PageCreateInput,
  ) {
    return this.cmsService.createPage(resolvePayload(data, payload));
  }

  @MessagePattern({ cmd: 'get_pages' })
  @Get('pages')
  findAllPages() {
    return this.cmsService.findAllPages();
  }

  @MessagePattern({ cmd: 'get_page_by_slug' })
  @Get('pages/slug/:slug')
  findPageBySlug(@Param('slug') slug: string, @Payload() payloadSlug: string) {
    return this.cmsService.findBySlug(resolveParam(slug, payloadSlug));
  }

  @Patch('pages/:id')
  updatePage(@Param('id') id: string, @Body() data: Prisma.PageUpdateInput) {
    return this.cmsService.updatePage(id, data);
  }

  @Delete('pages/:id')
  removePage(@Param('id') id: string) {
    return this.cmsService.removePage(id);
  }

  // --- Resources ---
  @MessagePattern({ cmd: 'create_resource' })
  @Post('resources')
  createResource(
    @Body() data: Prisma.ResourceCreateInput,
    @Payload() payload: Prisma.ResourceCreateInput,
  ) {
    return this.cmsService.createResource(resolvePayload(data, payload));
  }

  @MessagePattern({ cmd: 'get_resources' })
  @Get('resources')
  findAllResources(
    @Query('type') type?: string,
    @Payload() payload?: { type?: string },
  ) {
    return this.cmsService.findAllResources(resolveParam(type, payload?.type));
  }

  @Patch('resources/:id')
  updateResource(
    @Param('id') id: string,
    @Body() data: Prisma.ResourceUpdateInput,
  ) {
    return this.cmsService.updateResource(id, data);
  }

  @Delete('resources/:id')
  removeResource(@Param('id') id: string) {
    return this.cmsService.removeResource(id);
  }

  // --- Webinars ---
  @MessagePattern({ cmd: 'create_webinar' })
  @Post('webinars')
  createWebinar(
    @Body() data: Prisma.WebinarCreateInput,
    @Payload() payload: Prisma.WebinarCreateInput,
  ) {
    return this.cmsService.createWebinar(resolvePayload(data, payload));
  }

  @MessagePattern({ cmd: 'get_webinars' })
  @Get('webinars')
  findAllWebinars() {
    return this.cmsService.findAllWebinars();
  }

  @Patch('webinars/:id')
  updateWebinar(
    @Param('id') id: string,
    @Body() data: Prisma.WebinarUpdateInput,
  ) {
    return this.cmsService.updateWebinar(id, data);
  }

  @Delete('webinars/:id')
  removeWebinar(@Param('id') id: string) {
    return this.cmsService.removeWebinar(id);
  }

  // --- Testimonials ---
  @MessagePattern({ cmd: 'create_testimonial' })
  @Post('testimonials')
  createTestimonial(
    @Body() data: Prisma.TestimonialCreateInput,
    @Payload() payload: Prisma.TestimonialCreateInput,
  ) {
    return this.cmsService.createTestimonial(resolvePayload(data, payload));
  }

  @MessagePattern({ cmd: 'get_testimonials' })
  @Get('testimonials')
  findAllTestimonials() {
    return this.cmsService.findAllTestimonials();
  }

  @Patch('testimonials/:id')
  updateTestimonial(
    @Param('id') id: string,
    @Body() data: Prisma.TestimonialUpdateInput,
  ) {
    return this.cmsService.updateTestimonial(id, data);
  }

  @Delete('testimonials/:id')
  removeTestimonial(@Param('id') id: string) {
    return this.cmsService.removeTestimonial(id);
  }
}
