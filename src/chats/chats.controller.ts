import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { type AuthenticatedSocket } from '../auth/types/authentificated-socket.types';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get(':id/messages')
  async getMessages(@Param('id') id: string) {
    return this.chatsService.getMessages(id);
  }

  @Get()
  async getUserChats(@Request() req: AuthenticatedSocket) {
    const userId = +req.user.sub;
    return this.chatsService.getChats(+userId);
  }
}
