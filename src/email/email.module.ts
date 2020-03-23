import { Module } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { ENV } from '../env';

@Module({})
export class EmailModule {
  private transport = new nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ENV.SMTP_EMAIL_ADDRESS,
      pass: ENV.SMTP_EMAIL_PASSWORD,
    },
  });
}
