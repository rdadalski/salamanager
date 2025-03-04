import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

// This function can be called by Firebase Functions
export async function createNestApp(expressInstance: express.Express) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));

  // Add global middleware, CORS, etc. here if needed
  app.enableCors();

  return app;
}

// This function is used when running the app directly (not through Firebase)
async function bootstrap() {
  const server = express();
  const app = await createNestApp(server);
  await app.init();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Network access via: http://192.168.0.5:${port}`);

}

// Only call bootstrap when running directly (not when imported by Firebase Functions)
if (require.main === module) {
  bootstrap();
}
