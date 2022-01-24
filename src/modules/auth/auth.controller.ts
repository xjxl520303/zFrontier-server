import { Controller, Get, Query } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { AuthService } from './auth.service';

@swagger.ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get('mobile/authCode')
  async sendSms(
    @Query('type') type: 'register' | 'login',
  ) {

  }
}
