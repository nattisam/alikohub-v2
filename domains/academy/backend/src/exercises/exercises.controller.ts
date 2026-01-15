import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { SubmitExerciseDto } from './dto/submit-exercise.dto';
import { GradeExerciseDto } from './dto/grade-exercise.dto';
import { AuthenticatedUser } from 'src/user/user.service';
import { AcademyProfileGuard } from 'src/auth/academy-profile.guard';
import { RoleGuard } from 'src/auth/role-guard/role-guard';
import { Roles } from 'src/auth/role-guard/roles.decorator';

@Controller()
@UseGuards(AcademyProfileGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @MessagePattern({ cmd: 'create_exercise' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  create(@Payload() payload: { dto: CreateExerciseDto; user: AuthenticatedUser }) {
    return this.exercisesService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'find_exercises_by_module' })
  findAllByModule(@Payload() payload: { moduleId: number; user: AuthenticatedUser }) {
    return this.exercisesService.findAllByModule(payload.moduleId, payload.user);
  }

  @MessagePattern({ cmd: 'find_exercise_by_id' })
  findOne(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.exercisesService.findOne(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'update_exercise' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  update(@Payload() payload: { id: number; dto: UpdateExerciseDto; user: AuthenticatedUser }) {
    return this.exercisesService.update(payload.id, payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'remove_exercise' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  remove(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.exercisesService.remove(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'submit_exercise' })
  submit(@Payload() payload: { id: number; dto: SubmitExerciseDto; user: AuthenticatedUser }) {
    return this.exercisesService.submit(payload.id, payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'grade_exercise' })
  @UseGuards(RoleGuard)
  @Roles('INSTRUCTOR', 'ADMIN')
  grade(@Payload() payload: { id: number; dto: GradeExerciseDto; user: AuthenticatedUser }) {
    return this.exercisesService.grade(payload.id, payload.dto, payload.user);
  }
}
