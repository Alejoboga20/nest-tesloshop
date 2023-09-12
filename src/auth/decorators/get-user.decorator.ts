import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user as User;

  if (!user) throw new InternalServerErrorException('Request - User not found');

  return user;
});
