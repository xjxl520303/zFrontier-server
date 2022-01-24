import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'nestjs-prisma';
import { AuthConfig } from '../../configs/config.interface';
import { SmsModule } from '../../providers/sms/sms.module';
import { SmsService } from '../../providers/sms/sms.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './basic/local.strategy';
import { JwtRefreshTokenStrategy } from './jwt/jwt-refresh.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false
    }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const authConfig = configService.get<AuthConfig>('auth');
        return {
          secret: authConfig.accessToken,
          signOptions: {
            expiresIn: authConfig.accessTokenExpiresIn
          }
        }
      },
      inject: [ConfigService]
    }),
    SmsModule,
    UserModule
  ],
  providers: [
    Logger,
    PrismaService,
    ConfigService,
    UserService,
    AuthService,
    SmsService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy
  ],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
