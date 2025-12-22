import { IsEnum, IsNotEmpty } from 'class-validator';

export class AssignRoleDto {
    @IsEnum(['USER', 'ORGANIZER'])
    @IsNotEmpty()
    requestedRole!: 'USER' | 'ORGANIZER';
}