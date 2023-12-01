import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private db = admin.firestore();

  async isUuidProcessed(uuid: string): Promise<boolean> {
    const docRef = this.db.collection('uuids').doc(uuid);
    const doc = await docRef.get();
    return doc.exists;
  }

  async markUuidAsProcessed(uuid: string): Promise<void> {
    const docRef = this.db.collection('uuids').doc(uuid);
    await docRef.set({
      processed: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}
