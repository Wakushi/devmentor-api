import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async send(@Req() req, @Body() body) {
    const { email, rewardId } = body;
    console.log('req', req);
    console.log('body', body);
    console.log('to', email);
    console.log('rewardId', rewardId);
    return this.mailerService.sendMail(email, rewardId);
  }
}
