import { IsString, IsNotEmpty, IsEnum, IsOptional } from "class-validator";

export enum TargetAudience {
  ALL = "ALL",
  CHECKED_IN = "CHECKED_IN",
  NOT_CHECKED_IN = "NOT_CHECKED_IN",
  RSVP_YES = "RSVP_YES",
  RSVP_MAYBE = "RSVP_MAYBE",
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(TargetAudience)
  @IsNotEmpty()
  targetAudience: TargetAudience;

  @IsString()
  @IsOptional()
  replyTo?: string;
}
