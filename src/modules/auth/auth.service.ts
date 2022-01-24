import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SmsService } from '../../providers/sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly smsService: SmsService
  ) {}

  /**
   * 验证用户登录信息
   * @param mobile 手机号
   * @param password 密码
   */
  async validateUser(mobile: string, password: string): Promise<User> {
    return {} as User;
  }
}
