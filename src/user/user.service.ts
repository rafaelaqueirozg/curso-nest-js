import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePartiallyUserDto } from './dto/update-partially-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    return this.prisma.user.create({
      data: user,
    });
  }

  async read() {
    return this.prisma.user.findMany();
  }

  async readOne(id: number) {
    await this.checkIfExists(id);

    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, user: Partial<UpdateUserDto>) {
    await this.checkIfExists(id);

    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  async updatePartial(id: number, user: Partial<UpdatePartiallyUserDto>) {
    await this.checkIfExists(id);

    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }

  async delete(id: number) {
    await this.checkIfExists(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }

  private async checkIfExists(id: number): Promise<void> {
    const user = await this.prisma.user.count({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }
  }
}
