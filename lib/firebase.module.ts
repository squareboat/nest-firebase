import { Module, DynamicModule, Provider, HttpModule, Type } from '@nestjs/common';
import {
  FirebaseOptions,
  FirebaseAsyncOptions,
  FirebaseOptionsFactory,
} from './interfaces';
import { map } from './provider.map';
import { FirebaseService } from './firebase.service';
import { FirestoreService } from './services';

@Module({})
export class FirebaseModule {
  /**
   * Register options
   * @param options
   */
  static register(options: FirebaseOptions): DynamicModule {
    return {
      global: true,
      module: FirebaseModule,
      imports: [HttpModule],
      providers: [
        FirebaseService,
        FirestoreService,
        {
          provide: map.FIREBASE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [FirestoreService],
    };
  }

  /**
   * Register Async Options
   */
  static registerAsync(options: FirebaseAsyncOptions): DynamicModule {
    return {
      global: true,
      module: FirebaseModule,
      imports: [HttpModule],
      providers: [
        this.createStorageOptionsProvider(options),
        FirebaseService,
        FirestoreService,
      ],
      exports: [FirestoreService],
    };
  }

  private static createStorageOptionsProvider(
    options: FirebaseAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: map.FIREBASE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<FirebaseOptions>,
    ];
    return {
      provide: map.FIREBASE_OPTIONS,
      useFactory: async (optionsFactory: FirebaseOptionsFactory) =>
        await optionsFactory.createFirebaseOptions(),
      inject,
    };
  }
}
