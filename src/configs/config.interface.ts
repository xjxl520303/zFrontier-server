export interface Config {
  nest: NestConfig;
  app: AppConfig;
  cors: CorsConfig;
  csurf: CsurfConfig;
  swagger: SwaggerConfig;
  security: SecurityConfig;
  logger: LoggerConfig;
  db: DbConfig;
  tencentcloud: TencentcloudConfig;
  auth: AuthConfig;
}

export interface AppConfig {
  name: string;
  description: string;
}

export interface NestConfig {
  port: number;
  apiPrefix: string;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface CsurfConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
}

export interface LoggerConfig {
  enabled: boolean;
}

export interface DbConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export interface TencentcloudConfig {
  secretId: string;
  secretKey: string;
  region: string;
  sms: {
    smsAppId: string;
    region: string;
    signName: string;
  },
  captcha: {
    captchaAppId: string;
    region: string;
  }
}

export interface AuthConfig {
  accessToken: string;
  accessTokenExpiresIn: string;
  refreshToken: string;
  refreshTokenExpiresIn: string;
}
