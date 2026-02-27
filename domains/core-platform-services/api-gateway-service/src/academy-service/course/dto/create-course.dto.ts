import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCourseDto {
  @ApiProperty({ example: "Intro to NestJS" })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: "Learn NestJS basics" })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ example: "Full NestJS course" })
  @IsString()
  @IsOptional()
  longDescription?: string;

  @ApiPropertyOptional({
    type: "string",
    format: "binary",
    description: "Course thumbnail image",
  })
  @IsOptional()
  thumbnail?: any;

  @ApiPropertyOptional({ example: "Backend" })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    enum: ["DRAFT", "PENDING_APPROVAL", "PUBLISHED", "REJECTED", "ARCHIVED"],
    example: "DRAFT",
  })
  @IsEnum(["DRAFT", "PENDING_APPROVAL", "PUBLISHED", "REJECTED", "ARCHIVED"])
  status!: string;

  @ApiPropertyOptional({ example: ["Master NestJS", "Build APIs"] })
  @IsOptional()
  outcomes?: string[];

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @IsOptional()
  enrolledNum?: number;
}
