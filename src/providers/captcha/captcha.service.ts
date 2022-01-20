import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import { ClientConfig } from 'tencentcloud-sdk-nodejs/src/common/interface';
import { TencentcloudConfig } from "src/configs/config.interface";

const CaptchaClient = tencentcloud.captcha.v20190722.Client;

@Injectable()
export class CaptchaService {
  client: any;
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService
  ) {
    const { secretId, secretKey, region } = this.configService.get<TencentcloudConfig>('tencentcloud');
    const clientConfig: ClientConfig = {
      credential: {
        secretId,
        secretKey
      },
      region,
      profile: {
        httpProfile: {
          endpoint: "captcha.tencentcloudapi.com"
        }
      }
    };
    this.client = new CaptchaClient(clientConfig);
  }
}
