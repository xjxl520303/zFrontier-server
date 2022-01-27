import { IsIn, IsObject, IsOptional, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";
import * as swagger from '@nestjs/swagger';

class CaptchaDto {
  @IsString()
  ticket;

  @IsString()
  randstr;

  @IsString()
  captchaid;
}

/**
 * 发送短信验证码
 */
export class AuthCodeDto {
  @IsString()
  @IsIn(['register'])
  type;

  @IsString()
  @IsPhoneNumber('CH', { message: '手机号格式应为：+[国家（或地区）码][手机号]，例如：+8613711112222' })
  mobile;

  @IsString()
  @MinLength(8, { message: '密码至少8个字符' })
  @IsOptional()
  password?;

  @IsString()
  @Length(6, 6, { message: '请正确填写短信验证码'})
  @IsOptional()
  code?;

  @IsString()
  nickname = 'random';

  @IsObject()
  @IsOptional()
  captcha?: CaptchaDto;
}

/**
 * 手机号码登录
 */
export class LoginByMobileDto {
  @IsString()
  @IsPhoneNumber('CH', { message: '手机号格式应为：+[国家（或地区）码][手机号]，例如：+8613711112222' })
  @swagger.ApiProperty({ type: 'string', description: '手机号, 格式为：+[国家（或地区）码][手机号]' })
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
  type;

  @IsString()
  @IsPhoneNumber('CH', { message: '手机号格式应为：+[国家（或地区）码][手机号]，例如：+8613711112222' })
  @swagger.ApiProperty({ type: 'string', description: '手机号, 格式为：+[国家（或地区）码][手机号]' })
  mobile;

  @IsString()
  @MinLength(8, { message: '密码至少8个字符' })
  @IsOptional()
  @swagger.ApiProperty({ type: 'string', required: false, description: '密码' })
  password?;

  @IsString()
  @Length(6, 6, { message: '请正确填写短信验证码'})
  @IsOptional()
  @swagger.ApiProperty({ type: 'string', required: false, description: '验证码' })
  code?;

  @IsString()
  @swagger.ApiProperty({ type: 'string', required: false, description: '昵称' })
  nickname = 'random';

  @IsObject()
  @IsOptional()
  captcha?: CaptchaDto;
}
