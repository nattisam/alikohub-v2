import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignInstructorDto {
  @ApiProperty({
    example: 'firebase-user-id-123',
    description: 'Instructor userId from auth service',
  })
  @IsString()
  instructorId!: string;
}
