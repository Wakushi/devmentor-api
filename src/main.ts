import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

dotenv.config();

async function bootstrap() {
  console.log('Bootstrapping...');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`App started on port ${port}`);
}
bootstrap().catch((err) => process.stderr.write(err + '\n'));
