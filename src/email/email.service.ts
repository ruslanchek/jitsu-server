import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import mustache from 'mustache';
import { ENV } from '../env';
import { readFileSync } from 'fs';
import { IEmailDataInvite, IEmailDataWelcome, ITemplates } from './email.interfaces';
import { EMAIL_DATA } from '../constants';

sgMail.setApiKey(ENV.SENDGRID_KEY);

@Injectable()
export class EmailService {
  private render<TData = any>(template: string, data: TData): ITemplates {
    const sharedData = {
      year: new Date().getFullYear(),
      loginUrl: EMAIL_DATA.LOGIN,
      helpUrl: EMAIL_DATA.HELP,
      supportEmail: EMAIL_DATA.SUPPORT_EMAIL,
      ...data,
    };
    const templateHtml = readFileSync(`./email-templates/${template}/content.html`, { encoding: 'utf8' });
    const templateText = readFileSync(`./email-templates/${template}/content.txt`, { encoding: 'utf8' });
    return {
      html: mustache.render(templateHtml, sharedData),
      text: mustache.render(templateText, sharedData),
    };
  }

  private async send(subject: string, email: string, templates: ITemplates) {
    return await sgMail.send({
      subject,
      from: {
        name: EMAIL_DATA.SENDER,
        email: EMAIL_DATA.EMAIL,
      },
      to: email,
      ...templates,
    });
  }

  public async sendWelcome(email: string, data: IEmailDataWelcome) {
    try {
      await this.send('Welcome to Jitsu!', email, this.render<IEmailDataWelcome>('welcome', data));
    } catch (e) {
      console.log(e);
    }
  }

  public async sendInvite(email: string, data: IEmailDataInvite) {
    try {
      await this.send('Welcome to Jitsu!', email, this.render<IEmailDataInvite>('user-invitation', data));
    } catch (e) {
      console.log(e);
    }
  }
}
