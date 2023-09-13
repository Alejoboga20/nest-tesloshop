import { UseGuards, applyDecorators } from '@nestjs/common';

import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuardGuard } from '../guards/user-role-guard/user-role-guard.guard';

export const Auth = (...roles: ValidRoles[]) => {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuardGuard),
  );
};
