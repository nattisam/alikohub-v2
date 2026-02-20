import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsOptional()
  time?: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({
    type: "string",
    format: "binary",
    description: "Event cover image",
  })
  @IsOptional()
  coverImage?: any;
}
