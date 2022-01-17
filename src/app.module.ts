import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { ConfigModule } from '@nestjs/config';
import config from './configs/config';
import { PrismaModule } from 'nestjs-prisma';
import { Logger } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    TaskModule
  ],
  controllers: [AppController],
  providers: [Logger, AppService],
})
export class AppModule {}
