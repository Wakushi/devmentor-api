import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './modules/mailer/mailer.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [MailerModule, ConfigModule.forRoot(), FirebaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
