import { Config } from './config.interface';

export default () => ({
  nest: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  app: {
    name: process.env.APP_NAME || 'zFrontier 装备在线',
    description: process.env.APP_DESCRIPTION || 'zFrontier 装备前线 - 机械键盘、键帽、HiFi、摄影装备发烧友聚集地。用更强的装备，探索更大的世界。'
  },
  cors: {
    enabled: JSON.parse(process.env.CORS_ENABLED) || false
  },
  swagger: {
    enabled: JSON.parse(process.env.SWAGGER_ENABLED) || false,
    title: process.env.SWAGGER_TITLE || 'Nestjs',
    description: process.env.SWAGGER_DESCRIPTION || 'Swagger API',
    version: process.env.SWAGGER_VERSION || '1.0',
    path: process.env.SWAGGER_PATH || 'api',
  },
  logger: {
    enabled: JSON.parse(process.env.LOGGER_ENABLED) || false
  },
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || 'zfrontier_development'
  }
} as Config);
