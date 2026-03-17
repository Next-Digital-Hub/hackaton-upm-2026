import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard, Roles } from 'nest-keycloak-connect';
import { AlertasService } from './alertas.service';
import { Alert } from './entities/alert.entity';

@Controller('alertas')
export class AlertasController {
  constructor(private readonly alertasService: AlertasService) { }

  @Get()
  async getAlerts(): Promise<Alert[]> {
    return await this.alertasService.findAll();
  }

  @Post()
  @Roles({ roles: ['admin'] })
  async createAlert(@Body() alertData: Partial<Alert>): Promise<Alert> {
    return await this.alertasService.create(alertData);
  }
}
