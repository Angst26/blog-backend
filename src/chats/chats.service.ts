import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatsService {
  constructor(private prismaService: PrismaService) {
  }
  async getMessages(id: string) {
    const chat = await this.prismaService.chat.findUnique({
      where: { id: +id },
      include: {
        messages: {
          include: {
            author: {
              select: {
                name: true,
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
    if (!chat) {
      throw new NotFoundException('No chats found');
    }

    return chat.messages;
  }

  async getChats(userId: number) {
    const chats = await this.prismaService.chat.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      take: 10,
    });
    return chats;
  }
}
