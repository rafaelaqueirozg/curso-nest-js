import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

@Controller('users')
export class UserController {
  @Post()
  create(@Body() body: any) {
    return { body };
  }

  @Get()
  read() {
    return { users: [] };
  }

  @Get(':id')
  readOne(@Param() params: any) {
    return { user: {}, params };
  }

  @Put(':id')
  update(@Param() params: any, @Body() body: any) {
    return { method: 'put', params, body };
  }

  @Patch(':id')
  updatePartial(@Param() params: any, @Body() body: any) {
    return { method: 'patch', params, body };
  }

  @Delete(':id')
  delete(@Param() params: any) {
    return { params };
  }
}
