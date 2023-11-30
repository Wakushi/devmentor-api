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
    const { email, rewardId } = body;
    console.log('body', body);
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    console.log('secret', secret);
    console.log('token', token);
    if (secret !== token) {
      throw new BadRequestException('Invalid token!');
    }
    if (!email || !rewardId) {
      throw new BadRequestException('Missing resource param!');
    }
    const result = await this.mailerService.sendMail(email, rewardId);
    res.json(result);
  }
}
