import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async send(@Req() req, @Body() body, @Res() res) {
    console.log('Ip: ', req.ip);
    console.log('Agent: ', req.headers['user-agent']);
    const { email, rewardId } = body;
    console.log('body', body);
    if (!email || !rewardId) {
      throw new BadRequestException('Missing resource param!');
    }
    const result = await this.mailerService.sendMail(email, rewardId);
    res.json(result);
  }
}
