import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const { authorization } = request.headers;

    const token = (authorization ?? '').split(' ')[1];

    try {
      const data = this.authService.checkToken(token) as User;

      request.tokenPayload = data;
      request.user = await this.userService.readOne(data.id);

      return true;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return false;
    }
  }
}
