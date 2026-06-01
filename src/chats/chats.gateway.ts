import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/guards/ws-jwt/ws-jwt.guard';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsJwtGuard)
export class ChatsGateway {
  constructor(private prismaService: PrismaService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connectToChat')
  async handleConnectToChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: number },
  ) {
    const roomName = this.getChatRoomName(data.chatId);

    await client.join(roomName);

    return { event: 'joined', room: roomName };
  }

  private getChatRoomName(id: number): string {
    return `chat_${id}`;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { text: string; chatId: number },
    @ConnectedSocket() client: any,
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
