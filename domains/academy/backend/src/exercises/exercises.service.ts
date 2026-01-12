import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { SubmitExerciseDto } from './dto/submit-exercise.dto';
import { GradeExerciseDto } from './dto/grade-exercise.dto';
import { AuthenticatedUser, UserService } from '../user/user.service';
import { ExerciseType, SubmissionStatus } from '@prisma/client';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService, private userService: UserService) {}

  async create(dto: CreateExerciseDto, user: AuthenticatedUser) {
    const academyProfile = await this.userService.getOrCreateProfile(user);

    // Validate Module ownership
    const module = await this.prisma.module.findUnique({
      where: { id: dto.moduleId },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Module not found');

    const isInstructor = module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to add exercises to this module.');
    }

    return this.prisma.exercise.create({
      data: {
        ...dto,
      },
    });
  }

  async findAllByModule(moduleId: number, user: AuthenticatedUser) {
    // Authorization check is similar to Lessons - must be enrolled, instructor, or admin
    // For now, we'll rely on the fact that if they can see the module (CourseModulesService), they can see the exercise metadata.
    // However, we should probably hide `correctAnswer` for students.
    
    // Simplification: Re-using the logic from CourseModulesService implicitly if we were to call this from there.
    // But since this is a standalone endpoint likely, we need to verify access.
    await this.verifyModuleAccess(moduleId, user);

    const exercises = await this.prisma.exercise.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
    });

    // Strip correct answers for students
    const academyProfile = await this.userService.getOrCreateProfile(user);
    const module = await this.prisma.module.findUnique({ where: { id: moduleId }, include: { course: true } });
    if (!module) throw new NotFoundException('Module not found');

    const isInstructor = module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      return exercises.map(ex => {
        const { correctAnswer, ...rest } = ex;
        return rest;
      });
    }

    return exercises;
  }

  async findOne(id: number, user: AuthenticatedUser) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: { 
        module: { include: { course: true } },
        lesson: true
      },
    });
    if (!exercise) throw new NotFoundException('Exercise not found');

    await this.verifyModuleAccess(exercise.moduleId, user);

    const academyProfile = await this.userService.getOrCreateProfile(user);
    const isInstructor = exercise.module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      const { correctAnswer, ...rest } = exercise;
      return rest;
    }

    return exercise;
  }

  async update(id: number, dto: UpdateExerciseDto, user: AuthenticatedUser) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: { module: { include: { course: true } } },
    });
    if (!exercise) throw new NotFoundException('Exercise not found');

    const academyProfile = await this.userService.getOrCreateProfile(user);
    const isInstructor = exercise.module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to update this exercise.');
    }

    return this.prisma.exercise.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, user: AuthenticatedUser) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: { module: { include: { course: true } } },
    });
    if (!exercise) throw new NotFoundException('Exercise not found');

    const academyProfile = await this.userService.getOrCreateProfile(user);
    const isInstructor = exercise.module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to delete this exercise.');
    }

    return this.prisma.exercise.delete({ where: { id } });
  }

  async submit(id: number, dto: SubmitExerciseDto, user: AuthenticatedUser) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: { module: { include: { course: true } } }
    });
    if (!exercise) throw new NotFoundException('Exercise not found');

    await this.verifyModuleAccess(exercise.moduleId, user);

    let isCorrect = false;
    let score = 0;
    let status: SubmissionStatus = SubmissionStatus.GRADED;

    // Auto-grading logic
    if (exercise.type === ExerciseType.MULTIPLE_CHOICE || exercise.type === ExerciseType.TRUE_FALSE) {
      // Comparison might differ based on data types (string vs object). Assuming simple equality for now.
      isCorrect = dto.answer === exercise.correctAnswer;
      score = isCorrect ? exercise.points : 0;
    } else if (exercise.type === ExerciseType.MATCHING) {
      // Logic for matching: Check if all pairs match
      // answer: [{"left": "A", "right": "1"}, ...]
      // correctAnswer: [{"left": "A", "right": "1"}, ...]
      const answerPairs = Array.isArray(dto.answer) ? dto.answer : [];
      const correctPairs = Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer : [];
      
      // Simple check: stringify and compare sorted or use validation util
      // For now, strict JSON equality
      if (JSON.stringify(answerPairs) === JSON.stringify(correctPairs)) {
        isCorrect = true;
        score = exercise.points;
      }
    } else if (exercise.type === ExerciseType.SHORT_TEXT) {
      status = SubmissionStatus.PENDING_REVIEW;
      score = 0; // To be determined
    }

    // Save submission
    // We use upsert to allow re-submission or we can block strict re-submissions
    // Prompt didn't specify, so Upserting (taking latest) seems user-friendly for "Practice"
    return this.prisma.exerciseSubmission.upsert({
      where: {
        userId_exerciseId: {
          userId: user.firebaseId,
          exerciseId: id
        }
      },
      update: {
        answer: dto.answer,
        isCorrect,
        score,
        status,
        updatedAt: new Date(),
        attemptCount: { increment: 1 }
      },
      create: {
        userId: user.firebaseId,
        exerciseId: id,
        answer: dto.answer,
        isCorrect,
        score,
        status,
      }
    });
  }

  async grade(submissionId: number, dto: GradeExerciseDto, user: AuthenticatedUser) {
    const submission = await this.prisma.exerciseSubmission.findUnique({
      where: { id: submissionId },
      include: { exercise: { include: { module: { include: { course: true } } } } }
    });
    if (!submission) throw new NotFoundException('Submission not found');

    const academyProfile = await this.userService.getOrCreateProfile(user);
    const isInstructor = submission.exercise.module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (!isInstructor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to grade this exercise.');
    }

    return this.prisma.exerciseSubmission.update({
      where: { id: submissionId },
      data: {
        isCorrect: dto.isCorrect,
        score: dto.score,
        feedback: dto.feedback,
        status: SubmissionStatus.GRADED
      }
    });
  }

  // Helper to verify student access
  private async verifyModuleAccess(moduleId: number, user: AuthenticatedUser) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Module not found');

    const academyProfile = await this.userService.getOrCreateProfile(user);
    const isInstructor = module.course.instructorId === user.firebaseId;
    const isAdmin = academyProfile.role === 'ADMIN';

    if (isInstructor || isAdmin) return;

    // Check enrollment
    const directEnrollment = await this.prisma.enrollment.findFirst({
        where: {
          userId: user.firebaseId,
          courseId: module.courseId,
          cohortId: null,
          status: 'ACTIVE'
        }
    });

    const cohortEnrollment = await this.prisma.enrollment.findFirst({
        where: {
          userId: user.firebaseId,
          cohort: { courseId: module.courseId },
          status: 'ACTIVE'
        }
    });

    if (!directEnrollment && !cohortEnrollment) {
      throw new ForbiddenException('You must be enrolled in this course to access exercises.');
    }
  }
}
