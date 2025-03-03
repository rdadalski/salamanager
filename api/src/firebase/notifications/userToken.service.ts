import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { UserToken } from '@app/firebase/notifications/models/user-token.model';

/**
 * UserTokenService is a service for managing user tokens in Firestore.
 * It extends the GenericFirestoreService to provide CRUD operations for UserToken documents.
 */
@Injectable()
export class UserTokenService {
  private genericService: GenericFirestoreService<UserToken>;

  /**
   * Creates an instance of UserTokenService.
   *
   * @param firebaseAdmin - The Firebase admin app instance.
   */
  constructor(@Inject('FIREBASE_ADMIN') firebaseAdmin: admin.app.App) {
    this.genericService = new GenericFirestoreService<UserToken>(firebaseAdmin, 'user_tokens');
  }

  /**
   * Saves a user token. If the token already exists, it updates the existing token.
   * Otherwise, it creates a new token.
   *
   * @param userId - The ID of the user.
   * @param token - The device token to be saved.
   * @param deviceInfo - Optional device information.
   * @returns A promise that resolves with the ID of the saved token.
   */
  async saveUserToken(userId: string, token: string, deviceInfo?: any): Promise<string> {
    // Check if token already exists
    console.log(token);
    try {
      const tokens = await this.genericService.findByQuery([
        { field: 'userId', operator: '==', value: userId },
        { field: 'token', operator: '==', value: token },
      ]);

      if (tokens.length > 0) {
        // Update existing token
        const tokenId = tokens[0].id;
        await this.genericService.update(tokenId, {
          updatedAt: new Date(),
          deviceInfo: deviceInfo || tokens[0].deviceInfo,
        });
        return tokenId;
      } else {
        // Create new token
        const newToken: UserToken = {
          userId,
          token,
          deviceInfo,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return this.genericService.create(newToken);
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Retrieves all tokens for a given user.
   *
   * @param userId - The ID of the user.
   * @returns A promise that resolves with an array of device tokens.
   */
  async getUserTokens(userId: string): Promise<string[]> {
    const tokens = await this.genericService.findByQuery([{ field: 'userId', operator: '==', value: userId }]);
    return tokens.map((t) => t.token);
  }
}
