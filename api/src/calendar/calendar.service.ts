import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { ICalendarEvent } from '@app/calendar/interfaces/calendar-event.interface';
import { UserService } from '@app/user/user.service';
import { firestore } from 'firebase-admin';
import Firestore = firestore.Firestore;
import process from 'node:process';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);
  private calendar: calendar_v3.Calendar;
  private db: Firestore = getFirestore();

  constructor(private usersService: UserService) {}

  private async getCalendarClient(idToken: string) {
    try {
      // Verify the Firebase ID token
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      const usersSnapshot = await this.db.collection('users').doc(uid).get();

      // Get the user from Firestore to retrieve their Google access token
      const userDoc = await getFirestore().collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new BadRequestException('User not found');
      }

      const userData = userDoc.data();

      // Create an OAuth2 client with the stored tokens
      const oAuth2Client = new google.auth.OAuth2(
        process.env.WEB_CLIENT_ID,
        process.env.WEB_CLIENT_SECRET,
        process.env.WEB_CLIENT_REDIRECT_URI
      );

      oAuth2Client.setCredentials({
        access_token: idToken,
        refresh_token: userData.googleRefreshToken,
      });

      // Setup token refresh handler
      // oAuth2Client.on('tokens', async (tokens) => {
      //   if (tokens.refresh_token) {
      //     // Store the new refresh token
      //     await getFirestore().collection('users').doc(uid).update({
      //       googleRefreshToken: tokens.refresh_token,
      //     });
      //   }
      //   if (tokens.access_token) {
      //     // Store the new access token
      //     await getFirestore().collection('users').doc(uid).update({
      //       googleAccessToken: tokens.access_token,
      //     });
      //   }
      // });

      // Create the calendar client
      return google.calendar({ version: 'v3', auth: oAuth2Client });
    } catch (error) {
      this.logger.error(`Failed to initialize Google Calendar client: ${error.message}`);
      throw error;
    }
  }

  // Get user's calendar events
  async listEvents(
    idToken: string,
    params: {
      timeMin?: string;
      timeMax?: string;
      maxResults?: number;
    } = {}
  ): Promise<ICalendarEvent[]> {
    try {
      const calendar = await this.getCalendarClient(idToken);

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        timeMax: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items as ICalendarEvent[];
    } catch (error) {
      this.logger.error(`Failed to list events: ${error.message}`);
      throw error;
    }
  }
}
