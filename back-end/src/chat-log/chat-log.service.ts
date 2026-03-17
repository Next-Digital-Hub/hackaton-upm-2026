import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatLog } from './entities/chat-log.entity';

@Injectable()
export class ChatLogService {
  constructor(
    @InjectRepository(ChatLog)
    private chatLogRepository: Repository<ChatLog>,
  ) {}

  async saveMessage(user: string, message: string, sender: 'user' | 'assistant'): Promise<ChatLog> {
    const chatLog = this.chatLogRepository.create({
      user,
      message,
      sender,
    });
    return await this.chatLogRepository.save(chatLog);
  }

  async getHistory(user: string): Promise<ChatLog[]> {
    return await this.chatLogRepository.find({
      where: { user },
      order: { timestamp: 'ASC' },
      take: 50,
    });
  }
}
