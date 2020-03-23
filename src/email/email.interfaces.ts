import { UserEntity } from '../user/user.entity';

export interface ITemplates {
  html: string;
  text: string;
}

export interface IEmailDataWelcome {
  username: string;
  name: string;
}
