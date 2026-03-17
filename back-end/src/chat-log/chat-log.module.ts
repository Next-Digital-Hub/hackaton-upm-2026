import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatLog } from './entities/chat-log.entity';
import { ChatLogService } from './chat-log.service';
import { ChatLogController } from './chat-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChatLog])],
  controllers: [ChatLogController],
  providers: [ChatLogService],
  exports: [ChatLogService],
})
export class ChatLogModule {}
