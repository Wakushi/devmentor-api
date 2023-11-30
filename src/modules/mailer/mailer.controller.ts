import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async send(@Req() req, @Body() body) {
    const { email, rewardId } = body;
    console.log('body', body);
    console.log('to', email);
    console.log('rewardId', rewardId);
    return this.mailerService.sendMail(email, rewardId);
  }
}
