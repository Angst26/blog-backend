import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Делаем модуль глобальным, чтобы не импортировать его в каждый новый модуль вручную
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <-- Экспортируем, чтобы он был доступен снаружи
})
export class PrismaModule {}