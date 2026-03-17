import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherLog } from './entities/weather-log.entity';
import { ChatLog } from './entities/chat-log.entity';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([WeatherLog, ChatLog]) // Registro local
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
