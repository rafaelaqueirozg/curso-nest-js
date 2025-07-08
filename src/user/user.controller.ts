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

@Controller('users')
export class UserController {
  @Post()
  create(@Body() body: CreateUserDto) {
    return { body };
  }

  @Get()
  read() {
    return { users: [] };
  }

  @Get(':id')
  readOne(@Param('id', ParseIntPipe) id: number) {
    return { user: {}, id };
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return { method: 'put', id, body };
  }

  @Patch(':id')
  updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePartiallyUserDto,
  ) {
    return { method: 'patch', id, body };
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return { id };
  }
}
