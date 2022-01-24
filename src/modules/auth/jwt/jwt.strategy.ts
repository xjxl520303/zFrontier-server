import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { AuthConfig } from '../../../configs/config.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.userToken
        }
      ]),
      secretOrKey: (() => {
        const authConfig = configService.get<AuthConfig>('auth');
        return authConfig.accessToken;
      })()
    });
  }

  async validate(userId: number) {
    return this.userService.getUserById(userId);
  }
}
