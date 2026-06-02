import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatsService } from './chats.service';
import { Server } from 'socket.io';
import { WsJwtGuard } from '../auth/guards/ws-jwt/ws-jwt.guard';
import { type AuthenticatedSocket } from '../auth/types/authentificated-socket.types';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsJwtGuard)
export class ChatsGateway {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly chatsService: ChatsService,
  ) {}
  private readonly logger = new Logger(ChatsGateway.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connectToAllChats')
  async connectToAllChats(@ConnectedSocket() client: AuthenticatedSocket) {
    const userId = +client.user.sub;
    const userChats = await this.chatsService.getChats(userId);

    const rooms = userChats.map((chat) => this.getChatRoomName(chat.id));

    if (rooms.length > 0) {
      await client.join(rooms);

      this.logger.log(
        `User ${userId} подключен к комнатам: ${rooms.join(', ')}`,
      );
    } else {
      this.logger.log(`User ID ${userId} пока не имеет чатов!`);
    }
  }

  @SubscribeMessage('connectToChat')
  async handleConnectToChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { chatId: number },
  ) {
    const roomName = this.getChatRoomName(data.chatId);

    await client.join(roomName);
    this.logger.log(
      `Socket ${client.id} (User ID: ${client.user?.sub}) зашел в чат ${data.chatId}`,
    );
    return { event: 'joined', room: roomName };
  }

  private getChatRoomName(id: number): string {
    return `chat_${id}`;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { text: string; chatId: number },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId: number = +client.user.sub;
    console.log(`Пользователь ${userId} отправил сообщение: ${data.text}`);
    const savedMessage = await this.prismaService.message.create({
      data: {
        chatId: data.chatId,
        authorId: userId,
        text: data.text,
      },
    });
    const roomName = this.getChatRoomName(data.chatId);

    this.server.to(roomName).emit('newMessage', savedMessage);

    return savedMessage;
  }
}
