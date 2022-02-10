import { HttpException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import { ClientConfig } from 'tencentcloud-sdk-nodejs/src/common/interface';
import { TencentcloudConfig } from "src/configs/config.interface";
import { toLowerCaseOfObjectKey, toUpperCaseOfObjectKey, isDigit } from '../../helpers';
import {
  DescribeSmsTemplateListRequest,
  SendSmsRequest
} from "tencentcloud-sdk-nodejs/tencentcloud/services/sms/v20210111/sms_models";
import { Client } from "tencentcloud-sdk-nodejs/tencentcloud/services/sms/v20210111/sms_client";
import PQueue from 'p-queue';
import pRetry from "p-retry";

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
  tencentcloudConfig: TencentcloudConfig;
  private queue = new PQueue({ concurrency: 1 });

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService
  ) {
    this.tencentcloudConfig = this.configService.get<TencentcloudConfig>('tencentcloud');
    const { secretId, secretKey, sms } = this.tencentcloudConfig;
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
   * 发送单条短信
   * @param smsType 短信类型 0:普通短信 1:营销短信
   */
  async sendSms(payload: SendSmsParams, smsType: 0 | 1 = 0) {
    const { sms } = this.tencentcloudConfig;
    const params = Object.assign(
      { signName: this.signName, smsSdkAppId: this.appId },
      payload
    );

    if (params.phoneNumberSet.length > 1) {
      const error = new Error('只支持单条短信发送，批量请使用 sendMultiSms() 方法')
      this.logger.error(error);
      throw error;
    }

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
    const send = async () => {
      const { sendStatusSet } = toLowerCaseOfObjectKey(await this.client.SendSms(convertedParams));
      const isFail = sendStatusSet[0]?.code !== 'Ok';
      if (isFail) {
        throw new Error(sendStatusSet[0]?.message);
      }
      return '短信发送成功';
    }

    try {
      return await this.queue.add(async () =>
        await pRetry(send, {
          retries: sms.retries,
          onFailedAttempt: (err) => {
            this.logger.error(`短信发送给${convertedParams.PhoneNumberSet[0]}失败, 剩余(${err.retriesLeft}次尝试)`, err.message);
            if (!err.retriesLeft) {
              throw new Error(`短信[${convertedParams.TemplateId}]发送[${convertedParams.PhoneNumberSet[0]}]失败`);
            }
          }
        })
      )
    } catch (err) {
      throw new HttpException(err, err.status);
    }
  }
}
