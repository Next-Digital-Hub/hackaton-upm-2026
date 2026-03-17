import { Controller, Post, Body, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherLog } from './weather-log.entity';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post('save')
  async saveLog(@Body() weatherData: any): Promise<{ message: string; id: string }> {
    const saved = await this.weatherService.saveWeatherLog(weatherData);
    return {
      message: 'Weather data recorded successfully',
      id: saved.id
    };
  }

  @Get('history')
  async getHistory(): Promise<WeatherLog[]> {
    return await this.weatherService.getAllLogs();
  }

  @Post('chat/save')
  async saveChat(@Body() body: { userPrompt: string, assistantResponse: string, systemPrompt?: string }) {
    return await this.weatherService.saveChatLog(body.userPrompt, body.assistantResponse, body.systemPrompt);
  }
}

