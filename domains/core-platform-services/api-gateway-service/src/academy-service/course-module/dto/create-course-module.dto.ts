import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseModuleDto {
  @ApiProperty({ example: 'Introduction' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Module overview and goals' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  courseId!: number;
}
