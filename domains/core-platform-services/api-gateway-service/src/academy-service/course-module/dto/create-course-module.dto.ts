import { IsInt, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  order?: number;
}
