import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeatherLog } from './weather-log.entity';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(WeatherLog)
    private readonly weatherLogRepository: Repository<WeatherLog>,
  ) {}

  async saveWeatherLog(data: Partial<WeatherLog>): Promise<WeatherLog> {
    const newLog = this.weatherLogRepository.create(data);
    return await this.weatherLogRepository.save(newLog);
  }

  async getAllLogs(): Promise<WeatherLog[]> {
    return await this.weatherLogRepository.find({
      order: { savedAt: 'DESC' }
    });
  }
}