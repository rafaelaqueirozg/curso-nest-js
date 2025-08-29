import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthForgetDto } from './dto/auth-forget.dto';
import { AuthResetDto } from './dto/auth-reset.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { RoleGuard } from './guards/role.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Roles(Role.Admin)
  @Post('login')
  login(@Body() { email, password }: AuthLoginDto) {
    return this.authService.login(email, password);
  }

  @Roles(Role.Admin)
  @Post('register')
  register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }

  @Roles(Role.Admin)
  @Post('forget')
  forget(@Body() { email }: AuthForgetDto) {
    return this.authService.forget(email);
  }

  @Roles(Role.Admin)
  @Post('reset')
  reset(@Body() { password, token }: AuthResetDto) {
    return this.authService.reset(password, token);
  }

  @Roles(Role.Admin)
  @Post('me')
  me(@User() user: unknown) {
    return { user };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Roles(Role.Admin, Role.User)
  @Post('photo')
  uploadPhoto(
    @User() user: unknown,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/png' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 50 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    return this.fileService.uploadPhoto(user, photo);
  }

  @UseInterceptors(FilesInterceptor('files'))
  @Roles(Role.Admin, Role.User)
  @Post('files')
  uploadFiles(
    @User() user: unknown,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return files;
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photos', maxCount: 1 },
      { name: 'documents', maxCount: 10 },
    ]),
  )
  @Roles(Role.Admin, Role.User)
  @Post('file-fields')
  uploadFilesFields(
    @User() user: unknown,
    @UploadedFiles()
    files: {
      photos?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    return files;
  }
}
