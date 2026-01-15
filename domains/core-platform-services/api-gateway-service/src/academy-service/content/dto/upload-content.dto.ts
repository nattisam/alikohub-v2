import { IsEnum, IsInt, IsString, IsOptional } from 'class-validator';

// Define ContentType enum locally to avoid Prisma dependency
export enum ContentType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
}

export class UploadContentDto {
  @IsString()
  title!: string;

  @IsEnum(ContentType)
  type!: ContentType;

  @IsInt()
  lessonId!: number;

  @IsOptional()
  @IsString()
  description?: string;
}