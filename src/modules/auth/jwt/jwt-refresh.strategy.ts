import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { User } from '@prisma/client';
import { AuthConfig } from '../../../configs/config.interface';
import { TokenPayload } from '../token-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        }
      ]),
      secretOrKey: (() => {
        const authConfig = configService.get<AuthConfig>('auth');
        return authConfig.refreshToken
      })(),
      passReqToCallback: true
    });
  }

  async validate(request: Request, payload: TokenPayload): Promise<Pick<User, 'id'>> {
    const refreshToken = request.cookies?.Refresh;
    return await this.userService.isValidRefreshToken(refreshToken, payload.userId);
  }
}
