import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

dotenv.config();

async function bootstrap() {
  console.log('Bootstrapping...');
  let httpsOptions: HttpsOptions;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // cors: {
    //   origin: ['http://localhost:4200', 'http://localhost:3000'],
    //   methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    //   allowedHeaders: ['Content-Type', 'Authorization'],
    //   exposedHeaders: ['Authorization'],
    //   credentials: true,
    // },
    httpsOptions,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`App started on port ${port}`);
}
bootstrap().catch((err) => process.stderr.write(err + '\n'));
