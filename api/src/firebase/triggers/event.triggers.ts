import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { AttendanceStatus, IAttendee } from '../../utils/types';

function toTimestamp(dateValue: any): Timestamp {
  if (dateValue instanceof Timestamp) {
    return dateValue;
  }

  if (dateValue && typeof dateValue.seconds === 'number') {
    return new Timestamp(dateValue.seconds, dateValue.nanoseconds);
  }

  if (dateValue && typeof dateValue._seconds === 'number') {
    return new Timestamp(dateValue._seconds, dateValue._nanoseconds);
  }

  return Timestamp.fromDate(new Date(dateValue));
}

export const onEventUpdate = onDocumentUpdated(
  {
    document: 'events/{eventId}',
    region: 'europe-central2',
  },
  async (event) => {
    const eventId = event.params.eventId;
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) {
      logger.log('Event created or deleted, skipping update logic.');
      return;
    }

    const beforeStartTime = toTimestamp(beforeData.startTime);
    const afterStartTime = toTimestamp(afterData.startTime);

    if (beforeStartTime.isEqual(afterStartTime)) {
      logger.log(`Event ${eventId} updated, but startTime is unchanged. Exiting.`);
      return;
    }

    logger.log(`Time changed for event ${eventId}. Processing...`);

    const attendees: IAttendee[] = afterData.attendees || [];
    if (attendees.length === 0) {
      logger.log(`Event ${eventId} has no attendees.`);
      return;
    }

    const updatedAttendees: IAttendee[] = attendees.map((attendee) => ({
      ...attendee,
      status: AttendanceStatus.PENDING_CONFIRMATION,
    }));

    try {
      await event.data.after.ref.update({ attendees: updatedAttendees });
      logger.log(`Successfully updated attendees for event ${eventId} to pending status.`);
    } catch (error) {
      logger.error(`Failed to update attendee statuses for event ${eventId}:`, error);
      return;
    }

    const attendeeUids: string[] = updatedAttendees.map((attendee) => attendee.uid);

    const tokensPromises = attendeeUids.map((uid) =>
      getFirestore().collection('user_tokens').where('userId', '==', uid).get()
    );
    const tokensSnapshots = await Promise.all(tokensPromises);
    const allTokens = tokensSnapshots.flatMap((snap) => snap.docs.map((doc) => doc.data().token));

    if (allTokens.length === 0) {
      logger.log(`No FCM tokens found for any attendees of event ${eventId}.`);
      return;
    }

    const message = {
      notification: {
        title: 'Event Time Changed!',
        body: `The time for your event "${afterData.summary}" has been updated. Please confirm your attendance.`,
      },
      data: {
        eventId: eventId,
        screen: 'Notifications',
      },
      tokens: allTokens,
    };

    try {
      const response = await getMessaging().sendEachForMulticast(message);
      logger.log(`Successfully sent ${response.successCount} notifications for event ${eventId}.`);
    } catch (error) {
      logger.error(`Error sending notifications for event ${eventId}:`, error);
    }
  }
);
