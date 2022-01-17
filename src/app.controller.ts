import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

/**
  * Example of usage:
  * <example-url>http://localhost/demo/mysample.component.html</example-url>
  * <example-url>/demo/mysample.component.html</example-url>
  */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly logger: Logger) {}

  @Get()
  getHello(): string {
    this.logger.log(new Error('有问题来了'))
    return this.appService.getHello();
  }

  /**
   * @ignore
   */
  @Get()
  test(): string {
    return 'kkkk';
  }
}
