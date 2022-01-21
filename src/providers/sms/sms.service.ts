import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import { ClientConfig } from 'tencentcloud-sdk-nodejs/src/common/interface';
import { TencentcloudConfig } from "src/configs/config.interface";
import { toLowerCaseOfObjectKey, toUpperCaseOfObjectKey, isDigit} from 'src/helpers';
import { DescribeSmsTemplateListRequest, SendSmsRequest } from "tencentcloud-sdk-nodejs/tencentcloud/services/sms/v20210111/sms_models";
import { Client } from "tencentcloud-sdk-nodejs/tencentcloud/services/sms/v20210111/sms_client";

const SmsClient = tencentcloud.sms.v20210111.Client;

// 短信模板状态查询参数定义
type GetSmsTemplateStatusParams = UncapitalizeObject<Omit<DescribeSmsTemplateListRequest, 'Limit' | 'International'>>;
// 发送短信参数定义
type SendSmsParams = UncapitalizeObject<Omit<SendSmsRequest, 'SmsSdkAppId'>>;

@Injectable()
export class SmsService {
  client: Client;
  appId: string;
  signName: string;

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService
  ) {
    const { secretId, secretKey, sms } = this.configService.get<TencentcloudConfig>('tencentcloud');
    const clientConfig: ClientConfig = {
      credential: {
        secretId,
        secretKey
      },
      region: sms.region,
      profile: {
        httpProfile: {
          endpoint: "sms.tencentcloudapi.com"
        }
      }
    };
    this.appId = sms.smsAppId;
    this.signName = sms.signName;
    this.client = new SmsClient(clientConfig);
  }

  /**
   * 短信模板状态查询
   */
  async getSmsTemplateStatus(payload: GetSmsTemplateStatusParams = null) {
    const params = Object.assign(
      {
        International: 0,
        limit: 10
      },
      payload
    )
    const convertedParams = toUpperCaseOfObjectKey<DescribeSmsTemplateListRequest>(params);

    if (!params.templateIdSet || params.templateIdSet.length === 0) {
      delete convertedParams.TemplateIdSet;
    }

    try {
      const res = toLowerCaseOfObjectKey(await this.client.DescribeSmsTemplateList(convertedParams));
      return res;
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * 发送短信
   * @param smsType 短信类型 0:普通短信 1:营销短信
   */
  async sendSms(payload: SendSmsParams, smsType: 0 | 1 = 0) {
    const params = Object.assign(
      { signName: this.signName, smsSdkAppId: this.appId },
      payload
    )

    if (smsType === 0 && params.templateParamSet) {
      params.templateParamSet.some((item: string) => {
        if (item.length > 6 || !isDigit(item)) {
          const error = new Error('验证码短信模板变量的实际内容仅支持0 - 6位（包括6位）纯数字。')
          this.logger.error(error);
          throw error;
        }
      })
    }

    const convertedParams = toUpperCaseOfObjectKey<SendSmsRequest>(params);

    try {
      const res = toLowerCaseOfObjectKey(await this.client.SendSms(convertedParams));
      return res;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
