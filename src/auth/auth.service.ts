import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/utils/hash-password.util';

@Injectable()
export class AuthService {
  private readonly issuer = 'login';
  private readonly audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  generateToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        name: user.name,
      },
      {
        expiresIn: '7 days',
        subject: user.id.toString(),
        issuer: this.issuer,
        audience: this.audience,
      },
    );
  }

  checkToken(token: string): unknown {
    try {
      return this.jwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string): boolean {
    try {
      return !!this.checkToken(token);
    } catch (error) {
      console.error('Token inválido:', error);
      return false;
    }
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha inválidos');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email e/ou senha inválidos');
    }

    return this.generateToken(user);
  }

  async forget(email: string): Promise<true> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email inválido');
    }

    return true;
  }

  async reset(password: string, token: string): Promise<string> {
    // const payload = this.jwtService.verify(token);

    // if (!payload || !payload.userId) {
    //   throw new UnauthorizedException('Token inválido');
    // }

    const id = 0;

    const user = await this.prisma.user.update({
      where: { id },
      data: { password },
    });

    return this.generateToken(user);
  }

  async register(data: AuthRegisterDto): Promise<string> {
    const user = await this.userService.create(data);
    return this.generateToken(user);
  }
}
