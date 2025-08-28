import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthForgetDto } from './dto/auth-forget.dto';
import { AuthResetDto } from './dto/auth-reset.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { RoleGuard } from './guards/role.guard';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Roles(Role.Admin)
  @Post('login')
  login(@Body() { email, password }: AuthLoginDto) {
    return this.authService.login(email, password);
  }

  @Roles(Role.Admin)
  @Post('register')
  register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }

  @Roles(Role.Admin)
  @Post('forget')
  forget(@Body() { email }: AuthForgetDto) {
    return this.authService.forget(email);
  }

  @Roles(Role.Admin)
  @Post('reset')
  reset(@Body() { password, token }: AuthResetDto) {
    return this.authService.reset(password, token);
  }

  @Roles(Role.Admin)
  @Post('me')
  me(@User() user: unknown) {
    return { user };
  }
}
