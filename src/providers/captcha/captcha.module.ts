import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CaptchaService } from "./captcha.service";

@Module({
  imports: [ConfigModule],
  providers: [CaptchaService],
  exports: [Logger, CaptchaService]
})
export class CaptchaModule {}
