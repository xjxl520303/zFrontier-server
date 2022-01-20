import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import { ClientConfig } from 'tencentcloud-sdk-nodejs/src/common/interface';
import { TencentcloudConfig } from "src/configs/config.interface";
import { toLowerCaseOfObjectKey, toUpperCaseOfObjectKey, isDigit} from 'src/helpers';
import { DescribeSmsTemplateListRequest, SendSmsRequest } from "tencentcloud-sdk-nodejs/tencentcloud/services/sms/v20210111/sms_models";
import { Client } from "tencentcloud-sdk-nodejs/tencentcloud/services/sms/v20210111/sms_client";

const SmsClient = tencentcloud.sms.v20210111.Client;

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
   * @param templateIdSet 模板 ID 数组。数组为空时默认查询模板列表信息
   * @param international 是否国际/港澳台短信： 0：表示国内短信。 1：表示国际/港澳台短信。
   * @param limit 限制，最多100
   * @param offset 偏移
   */
  async getSmsTemplateStatus(
    templateIdSet?: Array<number>,
    international: 0 | 1 = 0,
    limit = 10,
    offset = 0
  ) {
    const params = toUpperCaseOfObjectKey<DescribeSmsTemplateListRequest>({ templateIdSet, international, limit, offset });

    if (!templateIdSet || templateIdSet.length === 0) {
      delete params.TemplateIdSet;
    }

    try {
      const res = toLowerCaseOfObjectKey(await this.client.DescribeSmsTemplateList(params));
      return res;
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * 发送短信
   * @param phoneNumberSet 下发手机号码，采用 E.164 标准，格式为+[国家或地区码][手机号]，单次请求最多支持200个手机号且要求全为境内手机号或全为境外手机号。
   * @param templateId 短信 SdkAppId，在[短信控制台]添加应用后生成的实际 SdkAppId
   * @param templateParamSet 模板参数，模板参数的个数需要与 TemplateId 对应模板的变量个数保持一致。
   * @param smsType 短信类型，0表示普通短信, 1表示营销短信。
   * @param signName 签名，发送国内短信该参数必填
   * @param smsSdkAppId 短信 SdkAppId，在 短信控制台 添加应用后生成的实际 SdkAppId，示例如1400006666。
   */
  async sendSms(
    phoneNumberSet: Array<string>,
    templateId: string,
    templateParamSet?: Array<string>,
    smsType: 0 | 1 = 0,
    signName = this.signName,
    smsSdkAppId = this.appId
  ) {
    if (smsType === 0 && templateParamSet) {
      templateParamSet.some((item: string) => {
        if (item.length > 6 || !isDigit(item)) {
          const error = new Error('验证码短信模板变量的实际内容仅支持0 - 6位（包括6位）纯数字。')
          this.logger.error(error);
          throw error;
        }
      })
    }

    const params = toUpperCaseOfObjectKey<SendSmsRequest>({ phoneNumberSet, templateId, templateParamSet, signName, smsSdkAppId });

    try {
      const res = toLowerCaseOfObjectKey(await this.client.SendSms(params));
      return res;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
