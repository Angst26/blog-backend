import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto, LoginUserDTO } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() payload: AuthUserDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  async login(@Body() payload: LoginUserDTO) {
    return this.authService.login(payload);
  }
}
