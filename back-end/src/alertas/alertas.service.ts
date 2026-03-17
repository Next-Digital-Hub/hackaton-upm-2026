import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';

@Injectable()
export class AlertasService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  async findAll(): Promise<Alert[]> {
    return await this.alertRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async create(alertData: Partial<Alert>): Promise<Alert> {
    const alert = this.alertRepository.create(alertData);
    return await this.alertRepository.save(alert);
  }
}
