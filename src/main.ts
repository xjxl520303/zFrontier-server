import { NestFactory } from '@nestjs/core';
// import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import csurf from 'csurf';
import { WinstonLogger } from './helpers';
import { NestConfig, CorsConfig, SwaggerConfig, LoggerConfig, CsurfConfig } from './configs/config.interface';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { HttpExceptionsFilter } from './filters';
import { ValidationPipe } from './pipes';
import { SuccessTransformInterceptor } from './interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false
  });

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const csurfConfig = configService.get<CsurfConfig>('csurf');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  const loggerConfig = configService.get<LoggerConfig>('logger');

  app.use(cookieParser());
  app.setGlobalPrefix(nestConfig.apiPrefix);
  app.useGlobalFilters(new HttpExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new SuccessTransformInterceptor())

  corsConfig.enabled && app.enableCors();
  csurfConfig.enabled && app.use(csurf({
    cookie: true
  }));
  loggerConfig.enabled && app.useLogger(WinstonLogger);

  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swaggerConfig.path, app, document);
  }

  await app.listen(nestConfig.port || 3000);
}
bootstrap();
