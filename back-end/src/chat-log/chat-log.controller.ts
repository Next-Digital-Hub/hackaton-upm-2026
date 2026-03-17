import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthenticatedUser, AuthGuard } from 'nest-keycloak-connect';
import { ChatLogService } from './chat-log.service';
import { ChatLog } from './entities/chat-log.entity';

@Controller('chat-log')
export class ChatLogController {
  constructor(private readonly chatLogService: ChatLogService) {}

  @Post('save')
  async saveMessage(
    @AuthenticatedUser() user: any,
    @Body() body: { message: string; sender: 'user' | 'assistant' },
  ): Promise<ChatLog> {
    return await this.chatLogService.saveMessage(
      user.preferred_username,
      body.message,
      body.sender,
    );
  }

  @Get('history')
  async getHistory(@AuthenticatedUser() user: any): Promise<ChatLog[]> {
    return await this.chatLogService.getHistory(user.preferred_username);
  }
}
