import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/client';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // Pages
  async createPage(data: Prisma.PageCreateInput) {
    return this.prisma.page.create({ data });
  }

  async findAllPages() {
    return this.prisma.page.findMany();
  }

  async findOnePage(id: string) {
    return this.prisma.page.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return this.prisma.page.findUnique({ where: { slug } });
  }

  async updatePage(id: string, data: Prisma.PageUpdateInput) {
    return this.prisma.page.update({ where: { id }, data });
  }

  async removePage(id: string) {
    return this.prisma.page.delete({ where: { id } });
  }

  // Resources
  async createResource(data: Prisma.ResourceCreateInput) {
    return this.prisma.resource.create({ data });
  }

  async findAllResources(type?: string) {
    const where = type ? { resourceType: type as any } : {};
    return this.prisma.resource.findMany({ where });
  }

  async findOneResource(id: string) {
    return this.prisma.resource.findUnique({ where: { id } });
  }

  async updateResource(id: string, data: Prisma.ResourceUpdateInput) {
    return this.prisma.resource.update({ where: { id }, data });
  }

  async removeResource(id: string) {
    return this.prisma.resource.delete({ where: { id } });
  }

  // Webinars
  async createWebinar(data: Prisma.WebinarCreateInput) {
    return this.prisma.webinar.create({ data });
  }

  async findAllWebinars() {
    return this.prisma.webinar.findMany();
  }

  async findOneWebinar(id: string) {
    return this.prisma.webinar.findUnique({ where: { id } });
  }

  async updateWebinar(id: string, data: Prisma.WebinarUpdateInput) {
    return this.prisma.webinar.update({ where: { id }, data });
  }

  async removeWebinar(id: string) {
    return this.prisma.webinar.delete({ where: { id } });
  }

  // Testimonials
  async createTestimonial(data: Prisma.TestimonialCreateInput) {
    return this.prisma.testimonial.create({ data });
  }

  async findAllTestimonials() {
    return this.prisma.testimonial.findMany();
  }

  async findOneTestimonial(id: string) {
    return this.prisma.testimonial.findUnique({ where: { id } });
  }

  async updateTestimonial(id: string, data: Prisma.TestimonialUpdateInput) {
    return this.prisma.testimonial.update({ where: { id }, data });
  }

  async removeTestimonial(id: string) {
    return this.prisma.testimonial.delete({ where: { id } });
  }
}
