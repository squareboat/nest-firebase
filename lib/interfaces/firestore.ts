export interface ReadManyOptions {
  collection: string;
  transformer?: any;
  asObject?: true | false;
  keyAsId?: string;
}

export interface ReadOneOptions {
  collection: string;
  document: string;
  transformer?: any;
}
