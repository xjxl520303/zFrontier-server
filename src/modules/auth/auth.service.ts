import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import ms from 'ms';
import { AuthConfig } from '../../configs/config.interface';
import { generateSmsShortId } from '../../helpers';
import { SmsService } from '../../providers/sms/sms.service';
import { UserService } from '../user/user.service';
import { mobileRegisterDto } from './auth.dto';
import { TokenPayload } from './token-payload.interface';

@Injectable()
export class AuthService {
  authConfig: AuthConfig;

  constructor(
    private readonly smsService: SmsService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    this.authConfig = configService.get<AuthConfig>('auth');
  }


  /**
   * 验证用户登录信息
   * @param mobile 手机号
   * @param password 密码
   */
  async validateUser(mobile: string, password: string): Promise<User> {
    try {
      const user = await this.userService.getUserByMobile(mobile);
      await this.userService.comparePassword(password, user.password);
      return user;
    } catch (err) {
      throw new HttpException({ message: '账号或密码错误 ﾉ)ﾟДﾟ(' }, err.status);
    }
  }

  /**
   * 发送注册验证码
   * @param mobile 手机号
   */
  async sendRegisterSms(mobile: string) {
    const isExist = await this.userService.isMobileExist(mobile);
    if (isExist) {
      throw new HttpException({ message: '当前手机号已注册过zFrontier, 请直接登录~' }, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return await this.smsService.sendSms({
      phoneNumberSet: [mobile],
      templateId: '1282279',
      templateParamSet: [generateSmsShortId()]
    })
  }

  /**
   * 使用手机号注册账户
   * @param payload 用户信息
   */
  async registerByMobile(payload: mobileRegisterDto) {
    return this.userService.createUserByMobile(payload);
  }

  /**
   * 通过 accessToken 获取 Cookie
   * @param userId 用户ID
   */
  getCookieByAccessToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.authConfig.accessToken,
      expiresIn: this.authConfig.accessTokenExpiresIn
    });
    const maxAge = ms(this.authConfig.accessTokenExpiresIn) / 1000;
    return `userToken=${token}; HttpOnly; Path=/; Max-Age=${maxAge}`;
  }

  /**
   * 通过 refreshToken 获取 Cookie
   * @param userId 用户ID
   */
  getCookieByRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.authConfig.refreshToken,
      expiresIn: this.authConfig.refreshTokenExpiresIn
    });
    const maxAge = ms(this.authConfig.refreshTokenExpiresIn) / 1000;
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${maxAge}`;
    return {
      cookie,
      token
    };
  }

  /**
   * 获取失效 Cookie 达到注销的目的
   */
  getCookieForLogout() {
    return ['userToken=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0'];
  }
}
