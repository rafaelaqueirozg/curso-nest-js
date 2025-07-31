import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const userId = Number(req.params.id);

    if (isNaN(userId) || userId <= 0) {
      throw new BadRequestException('ID inválido');
    }

    next();
  }
}
