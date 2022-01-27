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
import { SmsModule } from './providers/sms/sms.module';
import { SmsService } from './providers/sms/sms.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['.env', '.env.local']
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    TaskModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [Logger, AppService, SmsService],
})
export class AppModule {}
