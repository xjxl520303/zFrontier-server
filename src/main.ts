import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(csurf);
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
