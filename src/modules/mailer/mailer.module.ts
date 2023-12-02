import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';
import { MailerController } from './mailer.controller';
import { LockService } from 'src/services/lock.service';

@Module({
  imports: [ConfigModule],
  providers: [MailerService, LockService],
  controllers: [MailerController],
})
export class MailerModule {}
