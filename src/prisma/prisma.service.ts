import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // <-- Должно быть строго так

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({});
  }

  async onModuleInit() {
    await this.$connect();
    console.log('🐘 Успешное подключение к PostgreSQL через Prisma!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Соединение с PostgreSQL успешно закрыто.');
  }
}
