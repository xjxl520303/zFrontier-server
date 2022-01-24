import { NestFactory } from '@nestjs/core';
// import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as csurf from 'csurf';
import { WinstonLogger } from './helpers';
import { NestConfig, CorsConfig, SwaggerConfig, LoggerConfig } from './configs/config.interface';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionsFilter } from './filters';
import { ValidationPipe } from './pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false
  });

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  const loggerConfig = configService.get<LoggerConfig>('logger');


  app.use(cookieParser());
  app.use(csurf({
    cookie: true
  }));
  app.setGlobalPrefix(nestConfig.apiPrefix);
  app.useGlobalFilters(new HttpExceptionsFilter);
  app.useGlobalPipes(new ValidationPipe())

  corsConfig.enabled && app.enableCors();
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
