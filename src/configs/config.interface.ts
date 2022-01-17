export interface Config {
  nest: NestConfig;
  app: AppConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  security: SecurityConfig;
  logger: LoggerConfig;
  db: DbConfig;
}

export interface AppConfig {
  name: string;
  description: string;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
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
