import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './modules/mailer/mailer.module';
import { FirebaseModule } from './firebase/firebase.module';
import { LockService } from './services/lock.service';

@Module({
  imports: [MailerModule, ConfigModule.forRoot(), FirebaseModule],
  providers: [LockService],
  exports: [LockService],
})
export class AppModule {}
