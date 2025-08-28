import { IsJWT } from 'class-validator';

export class AuthMeDto {
  @IsJWT()
  token: string;
}
