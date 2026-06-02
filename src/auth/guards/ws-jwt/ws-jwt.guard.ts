import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type AuthenticatedSocket } from '../../types/authentificated-socket.types'

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  private readonly logger = new Logger(WsJwtGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Получаем сокет без явного указания типа Socket, чтобы линтер не привязывался к его интерфейсу
      const client: AuthenticatedSocket = context.switchToWs().getClient();

      const token = client?.handshake?.auth?.token;

      if (!token) {
        throw new UnauthorizedException('Токен не найден!');
      }

      // Верифицируем токен через наш JwtService
      const payload = await this.jwtService.verifyAsync(token);

      // Записываем данные пользователя в динамический ключ, используя квадратные скобки.
      client['user'] = payload;

      return true;
    } catch(error) {
      this.logger.error(
        `Ошибка авторизации сокета: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}
