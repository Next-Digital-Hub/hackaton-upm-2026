import { Controller, Post, Body, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';
// import { WeatherLog } from './entities/weather-log.entity'; // Importa si usas el tipo explícitamente

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // Recibe los datos JSON del frontend
  @Post('save')
  async saveLog(@Body() weatherData: any) {
    // weatherData viene con altitud, tmax, tmin, nombre, etc.
    const saved = await this.weatherService.saveWeatherLog(weatherData);
    return {
      message: 'Weather data recorded successfully',
      id: saved.id
    };
  }

  // Opcional: Ver el historial guardado
  @Get('history')
  async getHistory() {
    return await this.weatherService.getAllLogs();
  }
}