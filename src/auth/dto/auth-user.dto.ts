import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

export class AuthUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
}

export class LoginUserDTO extends PickType(AuthUserDto, [
  'email',
  'password',
] as const) {}
