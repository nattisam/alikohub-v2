import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { Prisma } from '../generated/client';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { resolvePayload } from '../common/utils/payload-resolver.util';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  // --- Availability Rules ---
  @MessagePattern({ cmd: 'create_availability_rule' })
  @Post('rules')
  createRule(
    @Body() data: Prisma.AvailabilityRuleCreateInput,
    @Payload() payload: Prisma.AvailabilityRuleCreateInput,
  ) {
    return this.availabilityService.createRule(resolvePayload(data, payload));
  }

  @MessagePattern({ cmd: 'get_availability_rules' })
  @Get('rules')
  findAllRules() {
    return this.availabilityService.findAllRules();
  }

  @Get('rules/:id')
  findOneRule(@Param('id') id: string) {
    return this.availabilityService.findOneRule(id);
  }

  @Patch('rules/:id')
  updateRule(
    @Param('id') id: string,
    @Body() data: Prisma.AvailabilityRuleUpdateInput,
  ) {
    return this.availabilityService.updateRule(id, data);
  }

  @Delete('rules/:id')
  removeRule(@Param('id') id: string) {
    return this.availabilityService.removeRule(id);
  }

  // --- Time Blocks ---
  @Post('time-blocks')
  createTimeBlock(@Body() data: Prisma.TimeBlockCreateInput) {
    return this.availabilityService.createTimeBlock(data);
  }

  @Get('time-blocks')
  findAllTimeBlocks() {
    return this.availabilityService.findAllTimeBlocks();
  }

  @Get('time-blocks/:id')
  findOneTimeBlock(@Param('id') id: string) {
    return this.availabilityService.findOneTimeBlock(id);
  }

  @Patch('time-blocks/:id')
  updateTimeBlock(
    @Param('id') id: string,
    @Body() data: Prisma.TimeBlockUpdateInput,
  ) {
    return this.availabilityService.updateTimeBlock(id, data);
  }

  @Delete('time-blocks/:id')
  removeTimeBlock(@Param('id') id: string) {
    return this.availabilityService.removeTimeBlock(id);
  }
}
