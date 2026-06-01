import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register({
    email,
    name,
    password,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    const hashedPass = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPass,
      },
    });

    const { password: pass, ...rest } = user;

    return rest;
  }

  async login({ email, password }: { email: string; password: string }) {
    //1 Нам нужно найти пользователя в базе данных по его email.
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    //2 Если пользователь с таким email не найден, нужно прервать процесс и сообщить об ошибке.
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден!');
    } else {
      //3 Если пользователь найден, нужно сравнить пришедший пароль с тем хэшем, который хранится в базе данных (используя await bcrypt.compare).
      const validPass = await bcrypt.compare(password, user.password);
      if (validPass) {
        const token = this.jwtService.sign({
          email: user.email,
          sub: user.id,
        });

        return {
          access_token: token,
        };
      } else {
        // todo сделать нормальный респонс на невалидный пароль
        throw new UnauthorizedException('Неверный пароль!')
      }
    }
  }
}
