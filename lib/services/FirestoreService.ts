import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import { ReadManyOptions, ReadOneOptions } from '../interfaces/firestore';
import { get } from 'lodash';

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
