import { Injectable, Inject, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/lib/messaging';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {}

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
   * Test the Firebase connection by writing and reading a test document
   * @returns A promise that resolves with the data of the test document
   */
  async testFirebaseConnection() {
    try {
      const testRef = this.firebaseAdmin.firestore().collection('test').doc('connection-test');

      await testRef.set({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        test: 'Connection successful',
      });

      const doc = await testRef.get();
      return doc.data();
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      throw error;
    }
  }
}
