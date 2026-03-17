import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakConnectModule } from 'nest-keycloak-connect';

@Global()
@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        authServerUrl: configService.get<string>('KEYCLOAK_AUTH_SERVER_URL')!,
        realm: configService.get<string>('KEYCLOAK_REALM')!,
        clientId: configService.get<string>('KEYCLOAK_CLIENT_ID')!,
        secret: configService.get<string>('KEYCLOAK_SECRET')!,
        roleMode: 'realm' as any,
        policyEnforcement: 'permissive' as any,
        tokenValidation: 'offline' as any,
      }),
    }),
  ],
  exports: [KeycloakConnectModule],
})
export class KeycloakConfigModule {}
