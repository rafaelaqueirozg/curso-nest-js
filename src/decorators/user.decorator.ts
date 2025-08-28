import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();

    if (!req.user) {
      throw new NotFoundException(
        'Usuário não encontrado. Use o AuthGuard para obter o usuário.',
      );
    }

    if (filter) {
      return req.user[filter];
    }

    return req.user;
  },
);
