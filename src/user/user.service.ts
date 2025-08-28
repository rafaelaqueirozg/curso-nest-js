import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePartiallyUserDto } from './dto/update-partially-user.dto';
import { generateHashedPassword } from 'src/utils/hash-password.util';
import { removeUndefined } from 'src/utils/object.util';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    const hashedPassword = await generateHashedPassword(user.password);

    return this.prisma.user.create({
      data: { ...user, password: hashedPassword },
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

  async update(id: number, user: UpdateUserDto) {
    await this.checkIfExists(id);

    const hashedPassword = await generateHashedPassword(user.password);

    return this.prisma.user.update({
      where: { id },
      data: { ...user, password: hashedPassword },
    });
  }

  async updatePartial(id: number, user: Partial<UpdatePartiallyUserDto>) {
    await this.checkIfExists(id);

    const data = removeUndefined(user);

    if (data.password) {
      data.password = await generateHashedPassword(data.password);
    }

    return this.prisma.user.update({
      where: { id },
      data,
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
