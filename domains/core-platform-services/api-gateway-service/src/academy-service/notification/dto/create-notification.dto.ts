import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Target user ID',
    example: 'uid_123456',
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your assignment has been graded',
  })
  @IsString()
  message!: string;

  @ApiProperty({
    description: 'Notification type',
    example: 'ASSIGNMENT',
  })
  @IsString()
  type!: string;
}
