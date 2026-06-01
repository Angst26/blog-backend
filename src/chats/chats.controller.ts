import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get(':id/messages')
  async getMessages(@Param('id') id: string) {
    return this.chatsService.getMessages(id);
  }

  @Get()
  async getChats() {
    return this.chatsService.getChats();
  }
}
