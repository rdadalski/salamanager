import { onRequest } from 'firebase-functions/https';
import express from 'express';
import { createNestApp } from '@app/main';

const expressServer = express();

let app: any;

// Import the compiled NestJS application
async function initializeNestApp() {
  try {
    app = await createNestApp(expressServer);
    await app.init();
    console.log('NestJS application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize NestJS application', error);
    throw error;
  }
}

// Export the Firebase Function
export const api = onRequest(
  {
    memory: '1GiB',
    timeoutSeconds: 300,
    region: 'europe-central2',
  },
  async (req, res) => {
    try {
      await initializeNestApp().catch((error) => {
        console.error('Initialization error:', error);
      });

      if (!app) {
        console.error('App failed to initialize after multiple attempts');
        res.status(500).send('Server is initializing, please try again shortly');
        return;
      }

      console.log('App initialized, handling request');
      return expressServer(req, res);
    } catch (e) {
      console.error(e);
      console.error(e.message);
    }
  }
);
