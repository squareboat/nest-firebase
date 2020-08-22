import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import { ReadManyOptions, ReadOneOptions } from '../interfaces/firestore';
import { DynamicLinkOptions } from '../interfaces';

@Injectable()
export class DynamicLinkService {
  static async create(options: DynamicLinkOptions) {
    const {
      dynamicLinks: { requestUrl, apiKey, dynamicLinkInfo, suffix },
    } = FirebaseService.getConfig();

    const payload = DynamicLinkService.preparePayload(options, {
      dynamicLinkInfo,
      suffix,
    });

    const config = { headers: { 'content-type': 'application/json' } };
    const http = FirebaseService.getHttpClient();

    try {
      const res = await http
        .post(`${requestUrl}?key=${apiKey}`, payload, config)
        .toPromise();
      return res.data;
    } catch (e) {
      return {};
    }
  }

  private static preparePayload(options: { [key: string]: any }, defaults: { [key: string]: any }) {
    if (typeof options === 'string') return options;
    if (typeof defaults === 'string') return defaults;

    options = options || {};
    defaults = defaults || {};

    const payload: { [key: string]: any } = {};
    const keys = Object.keys(options).concat(Object.keys(defaults));
    for (const key of keys) {
      payload[key] = DynamicLinkService.preparePayload(
        options[key],
        defaults[key],
      );
    }

    return payload;
  }
}
