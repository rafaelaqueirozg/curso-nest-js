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
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePartiallyUserDto } from './dto/update-partially-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Get()
  async read() {
    return await this.userService.read();
  }

  @Get(':id')
  async readOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.readOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return await this.userService.update(id, body);
  }

  @Patch(':id')
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePartiallyUserDto,
  ) {
    return await this.userService.updatePartial(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id);
  }
}
