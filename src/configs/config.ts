import { Config } from './config.interface';
import { getEnv, getEnvBoolean, getEnvNumber } from './helper';

export default () => ({
  nest: {
    port: getEnvNumber('PORT', 3000)
  },
  app: {
    name: getEnv('APP_NAME', 'zFrontier 装备在线'),
    description: getEnv('APP_DESCRIPTION', 'zFrontier 装备前线 - 机械键盘、键帽、HiFi、摄影装备发烧友聚集地。用更强的装备，探索更大的世界。')
  },
  cors: {
    enabled: getEnvBoolean('CORS_ENABLED')
  },
  swagger: {
    enabled: getEnvBoolean('SWAGGER_ENABLED'),
    title: getEnv('SWAGGER_TITLE', 'Nest.js'),
    description: getEnv('SWAGGER_DESCRIPTION', 'Swagger API'),
    version: getEnv('SWAGGER_VERSION', '1.0'),
    path: getEnv('SWAGGER_PATH', 'api'),
  },
  logger: {
    enabled: getEnvBoolean('LOGGER_ENABLED')
  },
  db: {
    user: getEnv('DB_USER'),
    password: getEnv('DB_PASSWORD'),
    host: getEnv('DB_HOST', 'localhost'),
    port: getEnvNumber('DB_PORT', 5432),
    database: getEnv('DB_DATABASE', 'zfrontier_development')
  },
  tencentcloud: {
    secretId: getEnv('TENCENTCLOUD_SECRET_ID'),
    secretKey: getEnv('TENCENTCLOUD_SECRET_KEY'),
    region: getEnv('TENCENTCLOUD_REGION'),
    sms: {
      smsAppId: getEnv('TENCENTCLOUD_SMS_APP_ID'),
      region: getEnv('TENCENTCLOUD_SMS_REGION'),
      signName: getEnv('TENCENTCLOUD_SMS_SIGN_NAME')
    },
    captcha: {
      captchaAppId: getEnv('TENCENTCLOUD_CAPTCHA_APP_ID'),
      region: getEnv('TENCENTCLOUD_CAPTCHA_REGION')
    }
  }
} as Config);
