import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  // NestJS сам маgroupирует зависимости. Он видит в конструкторе PrismaService
  // и автоматически "прокидывает" сюда созданный ранее синглтон базы.
  constructor(private readonly prisma: PrismaService) {}
}
