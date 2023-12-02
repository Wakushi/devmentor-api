import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {
  constructor() {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }
}
