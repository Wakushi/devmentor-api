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
import { LockService } from 'src/services/lock.service';

@Controller('mailer')
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly firebaseService: FirebaseService,
    private readonly lockService: LockService,
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

    if (!this.lockService.acquireLock(uuid)) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: 'Request is already being processed.' });
    }

    try {
      const success = await this.firebaseService.processUuid(uuid, async () => {
        await this.mailerService.sendMail(email, rewardId);
      });

      if (!success) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ message: 'Request already processed' });
      }

      res.json({ message: 'Email sent successfully' });
    } catch (error) {
      throw new BadRequestException(
        'An error occurred processing your request.',
      );
    } finally {
      this.lockService.releaseLock(uuid);
    }
  }

  @Post('application')
  @HttpCode(HttpStatus.OK)
  async sendMentorApplication(@Req() req, @Body() body, @Res() res) {
    const { address, selfIntroduction, contact, yearsOfExperience } = body;
    if (!address || !selfIntroduction || !contact || !yearsOfExperience) {
      throw new BadRequestException('Missing resource param!');
    }
    await this.mailerService.sendMentorApplication(
      address,
      selfIntroduction,
      contact,
      yearsOfExperience,
    );
    res.json({ message: 'applicationSent' });
  }
}
