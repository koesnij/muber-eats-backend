import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';

import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions, EmailVars } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    emailVars: EmailVars[],
  ): Promise<boolean> {
    const form = new FormData();
    form.append('from', `From Muber Eats <mailgun@${this.options.domain}>`);
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach(v => form.append(`v:${v.key}`, v.value));

    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    const emailVars = [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ];
    this.sendEmail(
      email,
      '[Muber Eats] Verify Your Email',
      'verify-email',
      emailVars,
    );
  }
}
