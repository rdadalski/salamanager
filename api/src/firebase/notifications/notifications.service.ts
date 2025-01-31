import { Injectable, Inject, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {}

  async saveExpoToken(userId: string, expoToken: string, deviceInfo: any) {
    try {
      await this.firebaseAdmin
        .firestore()
        .collection('user_tokens')
        .doc(userId)
        .set(
          {
            expoToken,
            deviceInfo,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

      this.logger.log(`Saved Expo token for user ${userId}`);
      return true;
    } catch (error) {
      this.logger.error(`Error saving Expo token for user ${userId}:`, error);
      throw error;
    }
  }

  async sendPushNotification(params: {
    token: string;
    title: string;
    body: string;
    data?: Record<string, any>;
  }) {
    const { token, title, body, data } = params;

    try {
      const message: admin.messaging.Message = {
        token,
        notification: {
          title,
          body,
        },
        data: {
          ...data,
          title,
          body,
          // Ensure all values are strings as required by FCM
          ...Object.entries(data || {}).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: String(value),
            }),
            {},
          ),
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
              contentAvailable: true,
            },
          },
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            priority: 'high',
            channelId: 'default',
          },
        },
      };

      const response = await this.firebaseAdmin.messaging().send(message);
      this.logger.log(`Notification sent successfully: ${response}`);
      return response;
    } catch (error) {
      this.logger.error('Error sending notification:', error);
      throw error;
    }
  }

  // async sendBatchNotifications(params: {
  //   tokens: string[];
  //   title: string;
  //   body: string;
  //   data?: Record<string, any>;
  // }) {
  //   const { tokens, title, body, data } = params;

  //   try {
  //     // Split tokens into chunks of 500 (FCM limit)
  //     const chunks = tokens.reduce((acc, token, i) => {
  //       const chunkIndex = Math.floor(i / 500);
  //       if (!acc[chunkIndex]) acc[chunkIndex] = [];
  //       acc[chunkIndex].push(token);
  //       return acc;
  //     }, [] as string[][]);

  //     let successCount = 0;
  //     let failureCount = 0;
  //     const failedTokens: string[] = [];

  //     // Process each chunk
  //     for (const tokenChunk of chunks) {
  //       const messages = tokenChunk.map((token) => ({
  //         token,
  //         notification: {
  //           title,
  //           body,
  //         },
  //         data: {
  //           ...data,
  //           title,
  //           body,
  //           ...Object.entries(data || {}).reduce(
  //             (acc, [key, value]) => ({
  //               ...acc,
  //               [key]: String(value),
  //             }),
  //             {},
  //           ),
  //         },
  //         apns: {
  //           payload: {
  //             aps: {
  //               sound: 'default',
  //               badge: 1,
  //               contentAvailable: true,
  //             },
  //           },
  //         },
  //         android: {
  //           priority: 'high',
  //           notification: {
  //             sound: 'default',
  //             priority: 'high',
  //             channelId: 'default',
  //           },
  //         },
  //       }));

  //       // Send messages in batch
  //       const response = await this.firebaseAdmin.messaging().sendAll(messages);

  //       successCount += response.successCount;
  //       failureCount += response.failureCount;

  //       // Track failed tokens
  //       response.responses.forEach((resp, idx) => {
  //         if (!resp.success) {
  //           failedTokens.push(tokenChunk[idx]);
  //         }
  //       });
  //     }

  //     this.logger.log(
  //       `Batch notification results - Success: ${successCount}, Failure: ${failureCount}`,
  //     );

  //     if (failureCount > 0) {
  //       this.logger.warn(`Failed to send to tokens:`, failedTokens);
  //     }

  //     return {
  //       successCount,
  //       failureCount,
  //       failedTokens,
  //     };
  //   } catch (error) {
  //     this.logger.error('Error sending batch notifications:', error);
  //     throw error;
  //   }
  // }

  async getUserDeviceTokens(userId: string): Promise<string[]> {
    try {
      const doc = await this.firebaseAdmin
        .firestore()
        .collection('user_tokens')
        .doc(userId)
        .get();

      if (!doc.exists) {
        return [];
      }

      const data = doc.data();
      return data?.expoToken ? [data.expoToken] : [];
    } catch (error) {
      this.logger.error(`Error getting tokens for user ${userId}:`, error);
      throw error;
    }
  }
}
