import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMail(to: string, rewardId: string) {
    const mailOptions = {
      from: 'devmentor.eth@gmail.com',
      to: to,
      subject: 'Reward claim from DevMentor!',
      text: `You have claimed reward with id ${rewardId}`,
    };

    const info = await this.transporter.sendMail(mailOptions);
    return info;
  }
}
