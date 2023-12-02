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

  async getUnusedCoupon(rewardId: string): Promise<Coupon> {
    const couponsRef = this.db
      .collection('rewards')
      .doc(rewardId)
      .collection('coupons');
    const snapshot = await couponsRef.where('used', '==', false).limit(1).get();
    if (snapshot.empty) {
      throw new Error('No unused coupons left.');
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...(doc.data() as Coupon) };
  }

  async redeemCoupon(rewardId: string, couponId: string) {
    const couponRef = this.db
      .collection('rewards')
      .doc(rewardId)
      .collection('coupons')
      .doc(couponId);
    await couponRef.update({ used: true });
  }

  async getRewardDetails(rewardId: string): Promise<RewardDetails> {
    const rewardRef = this.db.collection('rewards').doc(rewardId);
    const doc = await rewardRef.get();
    if (!doc.exists) {
      throw new Error('Reward not found.');
    }
    return doc.data() as RewardDetails;
  }
}
