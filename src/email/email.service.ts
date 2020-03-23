import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import mustache from 'mustache';
import { ENV } from '../env';
import { readFileSync } from 'fs';
import { IEmailDataWelcome, ITemplates } from './email.interfaces';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class EmailService {
  private transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ENV.SMTP_EMAIL_ADDRESS,
      pass: ENV.SMTP_EMAIL_PASSWORD,
    },
  });

  private render<TData = any>(template: string, data: TData): ITemplates {
    const templateHtml = readFileSync(`./email-templates/${template}/content.html`, { encoding: 'utf8' });
    const templateText = readFileSync(`./email-templates/${template}/content.txt`, { encoding: 'utf8' });
    return {
      html: mustache.render(templateHtml, data),
      text: mustache.render(templateText, data),
    };
  }

  private async send(subject: string, user: UserEntity, templates: ITemplates) {
    return await this.transport.sendMail({
      subject,
      from: 'mail@jitsu.works',
      sender: 'Jitsu',
      to: user.email,
      ...templates,
    });
  }

  public async sendWelcome(user: UserEntity, data: IEmailDataWelcome) {
    try {
      await this.send('Welcome to Jitsu!', user, this.render<IEmailDataWelcome>('welcome', data));
    } catch (e) {
      console.log(e);
    }
  }
}
