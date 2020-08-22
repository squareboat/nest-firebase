interface NotificationOptions {
  title: string;
  body: string;
}

export interface CloudMessagingOptions {
  notification: NotificationOptions;
  token?: string;
  tokens?: string[];
  android?: {
    ttl?: number;
    notification: NotificationOptions;
  };
  topic?: string;
  condition?: string;
  data?: Record<string, any>;
}
