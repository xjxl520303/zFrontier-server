import { Body, ClassSerializerInterceptor, Controller, Get, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ApiCustomErrorResponse, ApiCustomOkResponse } from '../../helpers/swagger/custom.decorator';
import { UserEntity } from '../user/user.entity';
import { UserResDto } from '../user/user.res.dto';
import { UserService } from '../user/user.service';
import { AuthCodeDto, LoginByMobileDto, mobileRegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './basic/local.guard';
import JwtRefreshGuard from './jwt/jwt-refresh.guard';

@Controller()
@ApiCustomErrorResponse()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('mobile/authCode')
  @swagger.ApiOperation({ summary: '发送短信验证码', tags: ['用户和授权']})
  async sendSms(@Body() data: AuthCodeDto) {
    return await this.authService.sendRegisterSms(data.mobile);
  }

  @Post('mobile/register')
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @swagger.ApiOperation({ summary: '手机号注册用户', tags: ['用户和授权']})
  @ApiCustomOkResponse(UserResDto)
  async mobileRegister(@Body() data: mobileRegisterDto) {
    const user = await this.authService.registerByMobile(data);
    return new UserEntity(user);
  }

  @Post('login/mobile')
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @swagger.ApiOperation({ summary: '手机号登录用户', tags: ['用户和授权']})
  @swagger.ApiBody({ type: LoginByMobileDto })
  @ApiCustomOkResponse(UserResDto)
  async loginByMobile(@Req() request: Request) {
    console.log('kkkkk')
    const user = request?.user as User;
    const accessTokenCookie = this.authService.getCookieByAccessToken(user.id);
    const refreshTokenCookie = this.authService.getCookieByRefreshToken(user.id);
    await this.userService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie]);
    return new UserEntity(user);
  }


  @Get('mobile/refresh')
  @UseGuards(JwtRefreshGuard)
  @swagger.ApiOperation({ summary: '刷新用户登录过期时间', tags: ['用户和授权']})
  @swagger.ApiBasicAuth('jwt-refresh-token')
  @ApiCustomOkResponse('刷新成功~')
  async refresh(@Req() request: Request) {
    const user = request?.user as User;
    const token = await this.authService.getCookieByAccessToken(user.id);
    request.res.setHeader('Set-Cookie', token);
    return '刷新成功~';
  }

  @Get('mobile/logout')
  @UseGuards(JwtRefreshGuard)
  @swagger.ApiOperation({ summary: '退出登录', tags: ['用户和授权']})
  @swagger.ApiBasicAuth('jwt-refresh-token')
  @ApiCustomOkResponse('退出成功~')
  async logout(@Req() request: Request) {
    const user = request?.user as User;
    await this.userService.removeRefreshToken(user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
    return '退出成功~';
  }
}
