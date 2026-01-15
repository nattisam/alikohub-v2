import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TeachingScheduleService } from './teaching-schedule.service';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';
import { CreateTeachingScheduleDto, UpdateTeachingScheduleDto } from './dto';

@Controller()
@UseGuards(AcademyProfileGuard)
export class TeachingScheduleController {
    constructor(private readonly teachingScheduleService: TeachingScheduleService) { }

    @MessagePattern({ cmd: 'get_instructor_schedules' })
    @UseGuards(RoleGuard)
    @Roles('INSTRUCTOR', 'ADMIN')
    async getInstructorSchedules(@Payload() payload: { user: AuthenticatedUser }) {
        return this.teachingScheduleService.getInstructorSchedules(payload.user);
    }

    @MessagePattern({ cmd: 'get_course_schedules' })
    @UseGuards(RoleGuard)
    @Roles('STUDENT', 'INSTRUCTOR', 'ADMIN')
    async getCourseSchedules(@Payload() payload: { courseId: number; user: AuthenticatedUser }) {
        return this.teachingScheduleService.getCourseSchedules(payload.courseId, payload.user);
    }

    @MessagePattern({ cmd: 'create_teaching_schedule' })
    @UseGuards(RoleGuard)
    @Roles('INSTRUCTOR', 'ADMIN')
    async createSchedule(@Payload() payload: { schedule: CreateTeachingScheduleDto; user: AuthenticatedUser }) {
        console.log('Received payload in backend:', JSON.stringify(payload, null, 2));
        return this.teachingScheduleService.createSchedule(payload.schedule, payload.user);
    }

    @MessagePattern({ cmd: 'update_teaching_schedule' })
    @UseGuards(RoleGuard)
    @Roles('INSTRUCTOR', 'ADMIN')
    async updateSchedule(@Payload() payload: { scheduleId: number; updateData: UpdateTeachingScheduleDto; user: AuthenticatedUser }) {
        return this.teachingScheduleService.updateSchedule(payload.scheduleId, payload.updateData, payload.user);
    }

    @MessagePattern({ cmd: 'delete_teaching_schedule' })
    @UseGuards(RoleGuard)
    @Roles('INSTRUCTOR', 'ADMIN')
    async deleteSchedule(@Payload() payload: { scheduleId: number; user: AuthenticatedUser }) {
        return this.teachingScheduleService.deleteSchedule(payload.scheduleId, payload.user);
    }

    @MessagePattern({ cmd: 'get_teaching_schedule' })
    @UseGuards(RoleGuard)
    @Roles('STUDENT', 'INSTRUCTOR', 'ADMIN')
    async getScheduleById(@Payload() payload: { scheduleId: number; user: AuthenticatedUser }) {
        return this.teachingScheduleService.getScheduleById(payload.scheduleId, payload.user);
    }
}