import { Injectable } from '@nestjs/common';
import { DecodedIdToken, getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  async verifyToken(idToken: string): Promise<DecodedIdToken> {
    try {
      return await getAuth().verifyIdToken(idToken);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
