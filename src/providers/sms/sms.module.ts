import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SmsService } from "./sms.service";

@Module({
  imports: [ConfigModule],
  providers: [Logger, SmsService],
  exports: [SmsService]
})
export class SmsModule {}
