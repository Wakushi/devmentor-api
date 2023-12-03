import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class MailerService {
  private transporter;

  constructor(private firebaseService: FirebaseService) {
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
    try {
      const rewardDetails =
        await this.firebaseService.getRewardDetails(rewardId);
      const coupon = await this.firebaseService.getUnusedCoupon(rewardId);
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h1 {
      color: #007bff;
      text-align: center;
    }
    .coupon-code {
      font-size: 20px;
      color: #d9534f;
    }
    a {
      color: #007bff;
      text-decoration: none;
      text-align: center;
    }
    a:hover {
      text-decoration: underline;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 0.8em;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h1>${rewardDetails.title}</h1>
    <p>${rewardDetails.description}</p>
    <p><strong>Your Coupon Code:</strong> <span class="coupon-code">${coupon.code}</span></p>
    <p>Please visit <a href="${rewardDetails.url}">${rewardDetails.url}</a> to redeem your coupon.</p>
    <p class="footer">Thank you for using DevMentor!</p>
  </div>
</body>
</html>
`;

      const mailOptions = {
        from: 'devmentor.eth@gmail.com',
        to: to,
        subject: `Reward claim from DevMentor: ${rewardDetails.title}`,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      await this.firebaseService.redeemCoupon(rewardId, coupon.id);
      console.log(`${to} is redeeming ${coupon.code} for ${rewardId}`);
      return { status: 'success', message: info };
    } catch (error) {
      console.error('Error sending mail:', error);
      throw error;
    }
  }

  async sendMentorApplication(
    address: string,
    selfIntroduction: string,
    contact: string,
    yearsOfExperience: string,
  ) {
    try {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h1 {
      color: #007bff;
      text-align: center;
    }
    .coupon-code {
      font-size: 20px;
      color: #d9534f;
    }
    a {
      color: #007bff;
      text-decoration: none;
      text-align: center;
    }
    a:hover {
      text-decoration: underline;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 0.8em;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h1>Mentor application</h1>
    <p>${address}</p>
    <h2>Self Introduction</h2>
    <p>${selfIntroduction}</p>
    <h2>Contact</h2>
    <p>${contact}</p>
    <h2>Years of Experience</h2>
    <p>${yearsOfExperience}</p>
  </div>
</body>
</html>
`;

      const mailOptions = {
        from: 'devmentor.eth@gmail.com',
        to: 'devmentor.eth@gmail.com',
        subject: `New Mentor Application: ${address}`,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return { status: 'success', message: info };
    } catch (error) {
      console.error('Error sending mail:', error);
      throw error;
    }
  }
}
