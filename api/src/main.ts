import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

export async function createNestApp(expressInstance: express.Express) {
  console.log('[DEBUG] main.ts: Inside createNestApp. Calling NestFactory.create...');
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));
  console.log('[DEBUG] main.ts: NestFactory.create has completed.');

  app.enableCors();

  console.log('[DEBUG] main.ts: Returning app instance.');
  return app;
}

async function bootstrap() {
  const server = express();
  const app = await createNestApp(server);
  await app.init();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}

if (require.main === module) {
  bootstrap();
}
