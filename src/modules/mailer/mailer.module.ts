import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';
import { MailerController } from './mailer.controller';
import { LockService } from 'src/services/lock.service';
import { createRateLimiter } from 'src/middleware/rate-limit.guard';

@Module({
  imports: [ConfigModule],
  providers: [MailerService, LockService],
  controllers: [MailerController],
})
export class MailerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(createRateLimiter(5, 60 * 60 * 1000)).forRoutes({
      path: 'mailer/application',
      method: RequestMethod.POST,
    });
  }
}
