import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '@app/user/models/user.model';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
