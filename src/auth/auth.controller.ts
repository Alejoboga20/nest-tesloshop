import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from 'src/common/decorators/raw-headers.decorator';
import { UserRoleGuardGuard } from './guards/user-role-guard/user-role-guard.guard';
import { ValidRoles } from './interfaces';
import { Auth, RoleProtected } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  /* Examples of custom decorators and guards */
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') email: string,
    @RawHeaders('Authorization') headers: string[],
  ) {
    return { user, email, headers };
  }

  @Get('private-two')
  //@SetMetadata('roles', ['admin', 'super-user']) , this is replace by SetMetadata(META_ROLES, args);
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuardGuard)
  testingPrivateRouteTwo(@GetUser() user: User) {
    return { user };
  }

  @Get('private-three')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  testingPrivateRouteThree(@GetUser() user: User) {
    return { user };
  }
}
