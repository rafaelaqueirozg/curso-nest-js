import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePartiallyUserDto } from './dto/update-partially-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/role.decorator';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Roles(Role.Admin, Role.User)
  @Get()
  async read() {
    return await this.userService.read();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  async readOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.readOne(id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return await this.userService.update(id, body);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePartiallyUserDto,
  ) {
    return await this.userService.updatePartial(id, body);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id);
  }
}
