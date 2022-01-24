import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  /**
   * 根据ID查询用户信息
   * @param userId 用户ID
   */
  async getUserById(userId: number): Promise<User> {
    return {} as User;
  }

  /**
   * 判断刷新Token是否有效
   * @param refreshToken 刷新Token
   * @param userId 用户ID
   */
  async isValidRefreshToken(refreshToken: string, userId: number): Promise<User> {
    return {} as User;
  }
}
