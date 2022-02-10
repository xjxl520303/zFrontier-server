import { IsIn, IsNotEmpty, IsObject, IsOptional, IsMobilePhone, IsString, Length, MinLength, ValidateNested } from "class-validator";
import * as swagger from '@nestjs/swagger';
import { Type } from "class-transformer";

class CaptchaDto {
  @IsString()
  @IsNotEmpty({ message: 'ticket不能为空' })
  @swagger.ApiProperty({ type: 'string', description: '票据' })
  ticket: string;

  @IsString()
  @IsNotEmpty({ message: 'randstr不能为空' })
  @swagger.ApiProperty({ type: 'string', description: '随机串' })
  randstr: string;

  @IsString()
  @IsNotEmpty({ message: 'captchaid不能为空' })
  @swagger.ApiProperty({ type: 'string', description: '验证码ID' })
  captchaid: string;
}

/**
 * 发送短信验证码
 */
export class AuthCodeDto {
  @IsString()
  @IsIn(['register'], { message: '[type]参数必须为register' })
  @swagger.ApiProperty({ type: 'string', description: '短信发送场景，这里默认传 `register`', default: 'register' })
  type;

  @IsString()
  @IsMobilePhone('zh-CN', { strictMode: false }, { message: '手机号错误' })
  @swagger.ApiProperty({ type: 'string', description: '手机号' })
  mobile;

  @IsString()
  @IsOptional()
  @MinLength(8, { message: '密码至少8个字符' })
  @swagger.ApiPropertyOptional({ type: 'string', description: '密码' })
  password?;

  @IsString()
  @IsOptional()
  @Length(6, 6, { message: '请正确填写短信验证码'})
  @swagger.ApiPropertyOptional({ type: 'string', description: '短信验证码' })
  code?;

  @IsString()
  @IsNotEmpty({ message: 'nickname不能为空, 无值传random' })
  @swagger.ApiProperty({ type: 'string', description: '用户昵称，无值传 `random`', default: 'random' })
  nickname;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CaptchaDto)
  @swagger.ApiPropertyOptional({ type: CaptchaDto, description: '腾讯云验证码参数' })
  captcha?;
}

/**
 * 手机号码登录
 */
export class LoginByMobileDto {
  @IsString()
  @IsMobilePhone('zh-CN', { strictMode: false }, { message: '手机号错误' })
  @swagger.ApiProperty({ type: 'string', description: '手机号' })
  mobile;

  @IsString()
  @MinLength(8, { message: '密码至少8个字符' })
  @swagger.ApiProperty({ type: 'string', description: '密码' })
  password;
}

/**
 * 手机号码注册
 */
export class mobileRegisterDto {
  @IsString()
  @IsIn(['register'])
  @swagger.ApiProperty({ type: 'string', description: '短信发送场景，这里默认传 `register`', default: 'register' })
  type = 'register';

  @IsString()
  @IsMobilePhone('zh-CN', { strictMode: false }, { message: '手机号错误' })
  @swagger.ApiProperty({ type: 'string', description: '手机号' })
  mobile: string;

  @IsString()
  @MinLength(8, { message: '密码至少8个字符' })
  @IsOptional()
  @swagger.ApiPropertyOptional({ type: 'string', description: '密码' })
  password?: string;

  @IsString()
  @Length(6, 6, { message: '请正确填写短信验证码'})
  @IsOptional()
  @swagger.ApiPropertyOptional({ type: 'string', description: '验证码' })
  code?: string;

  @IsString()
  @IsNotEmpty({ message: 'nickname不能为空, 无值传random' })
  @swagger.ApiProperty({ type: 'string', description: '用户昵称，无值传 `random`', default: 'random' })
  nickname = 'random';

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CaptchaDto)
  @swagger.ApiPropertyOptional({ type: CaptchaDto, description: '腾讯云验证码参数' })
  captcha?;
}
