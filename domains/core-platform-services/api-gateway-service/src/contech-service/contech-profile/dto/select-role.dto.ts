import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ContechRoleDto {
  CLIENT = 'CLIENT',
  CONTRACTOR = 'CONTRACTOR',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class SelectRoleDto {
  @ApiProperty({
    description: 'Role to assign to the user',
    enum: ContechRoleDto,
    example: ContechRoleDto.CLIENT,
  })
  @IsNotEmpty()
  @IsEnum(ContechRoleDto, {
    message: 'Role must be one of: CLIENT, CONTRACTOR, PROJECT_MANAGER, ADMIN, USER',
  })
  role!: ContechRoleDto;
}
