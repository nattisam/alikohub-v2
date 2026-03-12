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

  @MessagePattern({ cmd: 'update_page' })
  @Patch('pages/:id')
  updatePage(
    @Param('id') id: string,
    @Body() data: Prisma.PageUpdateInput,
    @Payload() payload: any,
  ) {
    const targetId = resolveParam(id, payload?.id);
    const resolvedData = resolvePayload(data, payload);
    return this.cmsService.updatePage(targetId, resolvedData);
  }

  @MessagePattern({ cmd: 'remove_page' })
  @Delete('pages/:id')
  removePage(@Param('id') id: string, @Payload() payload: any) {
    const targetId = resolveParam(id, payload?.id);
    return this.cmsService.removePage(targetId);
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

  @MessagePattern({ cmd: 'update_resource' })
  @Patch('resources/:id')
  updateResource(
    @Param('id') id: string,
    @Body() data: Prisma.ResourceUpdateInput,
    @Payload() payload: any,
  ) {
    const targetId = resolveParam(id, payload?.id);
    const resolvedData = resolvePayload(data, payload);
    return this.cmsService.updateResource(targetId, resolvedData);
  }

  @MessagePattern({ cmd: 'remove_resource' })
  @Delete('resources/:id')
  removeResource(@Param('id') id: string, @Payload() payload: any) {
    const targetId = resolveParam(id, payload?.id);
    return this.cmsService.removeResource(targetId);
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

  @MessagePattern({ cmd: 'update_webinar' })
  @Patch('webinars/:id')
  updateWebinar(
    @Param('id') id: string,
    @Body() data: Prisma.WebinarUpdateInput,
    @Payload() payload: any,
  ) {
    const targetId = resolveParam(id, payload?.id);
    const resolvedData = resolvePayload(data, payload);
    return this.cmsService.updateWebinar(targetId, resolvedData);
  }

  @MessagePattern({ cmd: 'remove_webinar' })
  @Delete('webinars/:id')
  removeWebinar(@Param('id') id: string, @Payload() payload: any) {
    const targetId = resolveParam(id, payload?.id);
    return this.cmsService.removeWebinar(targetId);
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

  @MessagePattern({ cmd: 'update_testimonial' })
  @Patch('testimonials/:id')
  updateTestimonial(
    @Param('id') id: string,
    @Body() data: Prisma.TestimonialUpdateInput,
    @Payload() payload: any,
  ) {
    const targetId = resolveParam(id, payload?.id);
    const resolvedData = resolvePayload(data, payload);
    return this.cmsService.updateTestimonial(targetId, resolvedData);
  }

  @MessagePattern({ cmd: 'remove_testimonial' })
  @Delete('testimonials/:id')
  removeTestimonial(@Param('id') id: string, @Payload() payload: any) {
    const targetId = resolveParam(id, payload?.id);
    return this.cmsService.removeTestimonial(targetId);
  }
}
