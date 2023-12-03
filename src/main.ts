import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
  console.log('Bootstrapping...');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.set('trust proxy', 1);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`App started on port ${port}`);
}
bootstrap().catch((err) => process.stderr.write(err + '\n'));
