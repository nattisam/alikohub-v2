import { IsInt, IsString } from 'class-validator';

export class CreateCourseModuleDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsInt() courseId: number;
}
