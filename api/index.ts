import 'tsconfig-paths/register';
import { onRequest } from 'firebase-functions/https';
import express from 'express';
import { createNestApp } from './src/main';
import { onEventUpdate as onEventUpdateFunction } from './src/firebase/triggers/event.triggers';
import { INestApplication } from '@nestjs/common';

const expressServer = express();

let app: INestApplication;

// async function initializeNestApp() {
//   try {
//     app = await createNestApp(expressServer);
//     await app.init();
//     console.log('NestJS application initialized successfully');
//   } catch (error) {
//     console.error('Failed to initialize NestJS application', error);
//     throw error;
//   }
// }

const nestAppPromise: Promise<INestApplication> = createNestApp(expressServer)
  .then((nestApp) => {
    app = nestApp;
    console.log('[DEBUG] index.ts: NestJS app created successfully. Initializing...');
    return app.init();
  })
  .catch((err) => {
    console.error('[FATAL] NestJS application failed to initialize. Full error:', err);
    process.exit(1);
  });

console.log('[DEBUG] index.ts: Exporting the "api" function.');

export const api = onRequest(
  {
    memory: '1GiB',
    timeoutSeconds: 300,
    region: 'europe-central2',
    secrets: ['WEB_CLIENT_ID', 'WEB_CLIENT_SECRET', 'WEB_CLIENT_REDIRECT_URI'],
  },
  async (req, res) => {
    try {
      await nestAppPromise;

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

export const onEventUpdate = onEventUpdateFunction;
