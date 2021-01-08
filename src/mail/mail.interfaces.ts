export interface MailModuleOptions {
  isGlobal?: boolean;
  apiKey: string;
  domain: string;
  fromEmail: string;
}

export interface EmailVars {
  key: string;
  value: string;
}
