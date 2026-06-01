/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

type AuthenticatedSocket = Socket & {
  user: { sub: number; email: string };
};

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Получаем сокет без явного указания типа Socket, чтобы линтер не привязывался к его интерфейсу
      const client: AuthenticatedSocket = context.switchToWs().getClient();

      // Достаем токен через безопасное обращение к свойствам
      const token = client?.handshake?.auth?.token;

      if (!token) {
        throw new UnauthorizedException('Токен не найден!');
      }

      // Верифицируем токен через наш JwtService
      const payload = await this.jwtService.verifyAsync(token);

      // Записываем данные пользователя в динамический ключ, используя квадратные скобки.
      client['user'] = payload;

      return true;
    } catch {
      return false;
    }
  }
}
