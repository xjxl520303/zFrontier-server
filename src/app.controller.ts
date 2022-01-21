import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { SmsService } from './providers/sms/sms.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger,
    private readonly smsService: SmsService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * @ignore
   */
  @Get('sms')
  test() {
    this.smsService.getSmsTemplateStatus();

    // this.smsService.sendSms({
    //   phoneNumberSet: ['13247220346'],
    //   templateId: '1282279',
    //   templateParamSet: ['123456']
    // })
    return 'kkkk';
  }
}
