import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';

const googleClientId = defineSecret('GOOGLE_WEB_CLIENT_ID');

export const getGoogleConfig = onRequest(
  {
    secrets: ['GOOGLE_WEB_CLIENT_ID'], // Add this dependency array
  },
  async (request, response) => {
    response.json({
      clientId: googleClientId.value(),
    });
  }
);
