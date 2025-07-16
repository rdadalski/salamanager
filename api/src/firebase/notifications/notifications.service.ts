import { Injectable, Inject, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UserTokenService } from '@app/firebase/notifications/userToken.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App,
    private readonly userTokenService: UserTokenService
  ) {}

  /**
   * Send a notification to a specific device
   * @param token - The device token to send the notification to
   * @param notification - The notification payload containing title, body, and data
   * @returns A promise that resolves with the result of the send operation
   */
  async sendToDevice(token: string, notification: { title: string; body: string; data: any }) {
    try {
      const message = {
        token,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data,
        android: {
          // priority: 'high',
        },
        apns: {
          payload: {
            aps: {
              contentAvailable: true,
            },
          },
        },
      };

      const response = await this.firebaseAdmin.messaging().send(message);
      return { success: true, response };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a notification to multiple devices
   * @param tokens - An array of device tokens to send the notification to
   * @param notification - The notification payload containing title, body, and data
   * @returns A promise that resolves with the result of the send operation
   */
  async sendToDevices(tokens: string[], notification: any) {
    try {
      const message = {
        tokens,
        notification: {
          title: notification.title || 'New Notification',
          body: notification.body || '',
        },
        data: notification.data || {},
        android: {
          // priority: 'high',
        },
        apns: {
          payload: {
            aps: {
              contentAvailable: true,
            },
          },
        },
      };

      const response = await this.firebaseAdmin.messaging().sendEachForMulticast(message);
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
      };
    } catch (error) {
      console.error('Error sending multicast notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sends a silent, data-only push notification to all of a user's registered devices
   * to signal that their client application should force a logout.
   *
   * This is a critical security function used after an administrator changes a user's
   * role or permissions, ensuring their old, potentially more privileged session
   * is terminated immediately.
   *
   * @param {string} uid The unique identifier (UID) of the user to send the signal to.
   * @returns {Promise<void>} A promise that resolves when the notification has been sent.
   */
  async sendForceReauthNotification(uid: string) {
    const tokens = await this.userTokenService.getUserTokens(uid);

    if (tokens.length === 0) {
      this.logger.log(`No FCM tokens found for user ${uid}. Cannot send force re-auth signal.`);
      return;
    }

    const message = {
      // This 'data' payload is what the client app will receive.
      // It's silent and doesn't create a visible notification.
      data: {
        action: 'FORCE_REAUTH',
        reason: 'User role has been changed by an administrator.',
      },
      tokens: tokens,
    };

    try {
      const response = await this.sendToDevices(tokens, message);
      this.logger.log(`Successfully sent force re-auth signal to ${response.successCount} devices for user ${uid}.`);
      if (response.failureCount > 0) {
        this.logger.error(`Failed to send signal to ${response.failureCount} devices.`);
      }
    } catch (error) {
      this.logger.error(`Error sending force re-auth notification for user ${uid}`, error);
    }
  }
}
