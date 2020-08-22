import { Injectable, Inject, HttpService } from '@nestjs/common';
import { map } from './provider.map';
import { FirebaseOptions } from './interfaces';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private static config: FirebaseOptions;
  private static client: Record<string, any>;
  private static serviceClients: Record<string, any>;
  private static httpClient: HttpService;

  constructor(
    @Inject(map.FIREBASE_OPTIONS) private config: FirebaseOptions,
    private httpClient: HttpService,
  ) {
    FirebaseService.config = config;
    FirebaseService.serviceClients = {};
    FirebaseService.httpClient = httpClient;
    this.init();
  }

  init() {
    const config = FirebaseService.config;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(config.credentialsPath);
    FirebaseService.client = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: config.databaseUrl,
    });
  }

  getServiceClient(service: string) {
    if (FirebaseService.serviceClients[service]) {
      return FirebaseService.serviceClients[service];
    }

    return FirebaseService.client[service]();
  }

  static getClient() {
    return FirebaseService.client;
  }

  static getHttpClient() {
    return FirebaseService.httpClient;
  }

  static getConfig(): FirebaseOptions {
    return FirebaseService.config;
  }
}
