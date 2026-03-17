import { Controller, Get } from '@nestjs/common';
import { Public, Roles, AuthenticatedUser } from 'nest-keycloak-connect';

@Controller('api')
export class AppController {
  
  // No necesita token, dejará pasar a cualquiera
  @Get('publica')
  @Public() 
  getPublica() {
    return 'Ruta pública';
  }

  // Ya está protegida por defecto gracias a la configuración de app.module.ts
  @Get('privada')
  getPrivada(@AuthenticatedUser() keycloakUser: any) {
    return {
      mensaje: 'Solo usuarios con token ven esto',
      usuario: keycloakUser?.preferred_username 
    };
  }

  // Requiere un token válido y que el usuario tenga el rol "admin"
  @Get('administrador')
  @Roles({ roles: ['admin'] })
  getAdmin() {
    return 'Solo administradores ven esto';
  }
}
