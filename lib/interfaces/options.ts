import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export interface DynamicLinkOptions {
  requestUrl?: string;
  apiKey?: string;
  dynamicLinkInfo: {
    link?: string;
    domainUriPrefix?: string;
    androidInfo?: {
      androidPackageName?: string;
      androidFallbackLink?: string;
      androidMinPackageVersionCode?: string;
    };
    iosInfo?: {
      iosBundleId?: string;
      iosFallbackLink?: string;
      iosCustomScheme?: string;
      iosIpadFallbackLink?: string;
      iosIpadBundleId?: string;
      iosAppStoreId?: string;
    };
    navigationInfo?: {
      enableForcedRedirect?: boolean;
    };
    analyticsInfo?: {
      googlePlayAnalytics?: {
        utmSource?: string;
        utmMedium?: string;
        utmCampaign?: string;
        utmTerm?: string;
        utmContent?: string;
        gclid?: string;
      };
      itunesConnectAnalytics?: {
        at?: string;
        ct?: string;
        mt?: string;
        pt?: string;
      };
    };
    socialMetaTagInfo?: {
      socialTitle?: string;
      socialDescription?: string;
      socialImageLink?: string;
    };
  };
  suffix?: {
    option: string;
  };
}

export interface FirebaseOptions {
  credentialsPath: string;
  databaseUrl?: string;
  dynamicLinks?: DynamicLinkOptions;
}

export interface FirebaseOptionsFactory {
  createFirebaseOptions(): Promise<FirebaseOptions> | FirebaseOptions;
}

export interface FirebaseAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<FirebaseOptions>;
  useClass?: Type<FirebaseOptions>;
  useFactory?: (...args: any[]) => Promise<FirebaseOptions> | FirebaseOptions;
  inject?: any[];
}
