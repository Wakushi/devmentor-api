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
import { FirebaseService } from 'src/firebase/firebase.service';

@Controller('mailer')
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
    private firebaseService: FirebaseService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async send(@Req() req, @Body() body, @Res() res) {
    const { email, rewardId, uuid } = body;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const secret = process.env.SECRET_KEY;
    if (secret !== token) {
      throw new BadRequestException('Invalid token!');
    }
    if (!email || !rewardId || !uuid) {
      throw new BadRequestException('Missing resource param!');
    }

    const success = await this.firebaseService.processUuid(uuid, async () => {
      await this.mailerService.sendMail(email, rewardId);
    });

    if (!success) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: 'Request already processed' });
    }

    res.json({ message: 'Email sent successfully' });
  }
}
