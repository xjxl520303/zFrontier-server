import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare, genSalt, hash } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';
import { generateUserHomepageHash, handleCatchError } from '../../helpers';
import { mobileRegisterDto } from '../auth/auth.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * 使用手机号创建账户
   * @param dto 用户信息
   */
  async createUserByMobile(dto: mobileRegisterDto): Promise<User> {
    try {
      const { mobile, password, nickname } = dto;
      const _user = await this.prisma.user.findUnique({
        where: { mobile }
      });

      if (_user) {
        throw new HttpException('此手机号已被占用(⊙o⊙)', HttpStatus.UNPROCESSABLE_ENTITY)
      }

      const user = await this.prisma.user.create({
        data: {
          mobile,
          password: await this.hashPassword(password),
          hashId: generateUserHomepageHash(),
          nickname,
          avatarPath: '',
          cover: ''
        }
      });

      return user;
    } catch (err) {
      if (err.status) {
        throw new HttpException(err, err.status);
      } else {
        throw new InternalServerErrorException(err)
      }
    }
  }

  /**
   * 根据ID查询用户信息
   * @param userId 用户ID
   */
  async getUserById(userId: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        }
      });

      if (user) {
        return user;
      }

      throw new HttpException('当前用户ID不存在', HttpStatus.NOT_FOUND)
    } catch (err) {
      handleCatchError(err);
    }
  }

  /**
   * 根据手机号查询用户信息
   * @param mobile 手机号
   */
  async getUserByMobile(mobile: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { mobile }
      });

      if (user) {
        return user;
      }

      throw new HttpException('当前手机号未注册zFrontier', HttpStatus.NOT_FOUND)
    } catch (err) {
      handleCatchError(err);
    }
  }

  /**
   * 检查当前手机号是否注册过
   * @param mobile 手机号
   */
  async isMobileExist(mobile: string): Promise<Boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { mobile }
      });

      return !!user;
    } catch (err) {
      handleCatchError(err);
    }
  }

  /**
   * 判断刷新Token是否有效
   * @param refreshToken 刷新Token
   * @param userId 用户ID
   */
  async isValidRefreshToken(token: string, userId: number): Promise<Pick<User, 'id'>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          id: true,
          refreshToken: true
        }
      })

      if (user.refreshToken === token) {
        return user;
      }
    } catch (err) {
      handleCatchError(err);
    }
  }

  /**
   * 写入 refreshToken 到用户表
   * @param token Token
   * @param userId 用户ID
   */
  async setCurrentRefreshToken(token: string, userId: number) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          refreshToken: token
        }
      });
    } catch (err) {
      handleCatchError(err);
    }
  }

  /**
   * 删除 refreshToken 数据
   * @param userId 用户ID
   */
  async removeRefreshToken(userId: number) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          refreshToken: null
        }
      });
    } catch (err) {
      handleCatchError(err);
    }
  }

  async comparePassword(password, hashedPassword) {
    const isMatched = await compare(password, hashedPassword);

    if (!isMatched) {
      throw new HttpException({ message: '密码错误' }, HttpStatus.BAD_REQUEST);
    }
  }

  protected async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(12);
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
  }
}
