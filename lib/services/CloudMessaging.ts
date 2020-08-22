import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import { CloudMessagingOptions } from '../interfaces';

@Injectable()
export class CloudMessaging {
  private constructor(private client: Record<string, any>) { }

  static init() {
    return new CloudMessaging(FirebaseService.getClient());
  }

  async send(
    message: CloudMessagingOptions | CloudMessagingOptions[],
  ): Promise<Record<string, any>> {
    if (Array.isArray(message)) {
      const reports = [];
      for (const m of message) reports.push(await this.handleSend(m));
      return reports;
    }

    return await this.handleSend(message);
  }

  private async handleSend(message: Record<string, any>): Promise<Record<string, any>> {
    const func = Array.isArray(message.tokens) ? 'sendMulticast' : 'send';
    return await this.client.messaging()[func](message);
  }
}
