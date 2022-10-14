import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail() email: string;
  @Length(6) password: string;
  @IsNotEmpty() username: string;
}

export class LoginUserDto {
  @IsEmail() email: string;
  @Length(6) password: string;
}

export class LogoutUserDto {
  @IsNotEmpty() id: any;
}

export class JwtPayload {
  id: string;
  role: string;
}