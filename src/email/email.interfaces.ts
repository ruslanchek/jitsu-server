export interface ITemplates {
  html: string;
  text: string;
}

export interface IEmailDataWelcome {
  username: string;
  name: string;
  actionUrl: string;
}

export interface IEmailDataInvite {
  name: string;
  inviteSenderName: string;
  inviteSenderOrganizationName: string;
  actionUrl: string;
}
