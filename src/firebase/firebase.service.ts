import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private db = admin.firestore();

  async processUuid(
    uuid: string,
    callback: () => Promise<void>,
  ): Promise<boolean> {
    const docRef = this.db.collection('uuids').doc(uuid);

    try {
      await this.db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);

        if (doc.exists) {
          throw new Error('UUID has already been processed');
        }

        transaction.set(docRef, {
          processed: true,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        await callback();
      });

      return true;
    } catch (error) {
      console.error('Transaction failed: ', error);
      return false;
    }
  }
}
