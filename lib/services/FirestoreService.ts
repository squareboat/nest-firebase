import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import { ReadManyOptions, ReadOneOptions } from '../interfaces/firestore';

/**
 * Read a value by path, like lodash.get: a field whose name is the whole
 * path wins (Firestore allows "user.id" as a field name), then
 * "profile.id", "items[0].id" and "['a-b'].c" are followed.
 */
function get(obj: any, path: string): any {
  if (obj == null) return undefined;
  const p = String(path);
  if (p in Object(obj)) return obj[p];
  const keys: string[] = [];
  p.replace(/[^.[\]]+|\[(?:(\d+)|(["'])(.*?)\2)\]/g, (match, index, quote, quoted) => {
    keys.push(quote ? quoted : index !== undefined ? index : match);
    return match;
  });
  return keys.reduce((value, key) => (value == null ? undefined : value[key]), obj);
}

@Injectable()
export class FirestoreService {
  protected db: Record<string, any>;
  constructor(protected firebase: FirebaseService) {
    this.db = firebase.getServiceClient('firestore');
  }

  async readMany(
    options: ReadManyOptions,
  ): Promise<Array<Record<string, any>> | Record<string, any>> {
    const { collection, transformer, asObject, keyAsId } = options;
    const dataObj: { [key: string]: any } = {};
    const dataArr = [];

    const snapshots = await this.db.collection(collection).get();
    for (const doc of snapshots._docs()) {
      const transformedData = await this.transform(doc, transformer);
      if (asObject && keyAsId) {
        dataObj[get(doc.data(), keyAsId)] = transformedData;
      } else {
        dataArr.push(transformedData);
      }
    }

    return asObject ? dataObj : dataArr;
  }

  async readOne(options: ReadOneOptions): Promise<Record<string, any>> {
    const { collection, document, transformer } = options;
    const doc = await this.db
      .collection(collection)
      .doc(document)
      .get();
    return await this.transform(doc, transformer);
  }

  async deleteOne(options: ReadOneOptions): Promise<boolean> {
    const { collection, document } = options;
    await this.db
      .collection(collection)
      .doc(document)
      .delete();
    return true;
  }

  async transform(doc: Record<string, any>, transformer?: any) {
    if (!doc || !doc.data()) {
      return;
    }

    return transformer ? await transformer.transform(doc) : doc;
  }
}
