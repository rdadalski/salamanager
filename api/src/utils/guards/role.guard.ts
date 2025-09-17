import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@app/user/models/user.model';
import { ROLES_KEY } from '@app/utils/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRole = user?.role;

    // if (userRole === UserRole.SUPER_ADMIN) {
    //   return true;
    // }

    if (!userRole) {
      throw new ForbiddenException('User role not found in token.');
    }

    const hasPermission = requiredRoles.some((role) => userRole === role);

    if (!hasPermission) {
      throw new ForbiddenException('You do not have the required role to access this resource.');
    }

    return true;
  }
}
