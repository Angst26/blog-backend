import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  // NestJS сам маgroupирует зависимости. Он видит в конструкторе PrismaService
  // и автоматически "прокидывает" сюда созданный ранее синглтон базы.
  constructor(private readonly prisma: PrismaService) {}

  @Get('users') // Наш эндпоинт: http://localhost:3000/users
  async getUsers() {
    // Пишем обычный запрос через Prisma Client
    const users = await this.prisma.user.findMany({
      include: { posts: true }, // Сразу подтянем и его статьи для красоты
    });

    return users;
  }
}
