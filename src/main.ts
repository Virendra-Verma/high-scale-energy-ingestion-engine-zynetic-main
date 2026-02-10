import * as dotenv from 'dotenv';
import * as path from 'path';

// 1. Sabse pehle environment variables load karein
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// 2. Uske baad hi baaki imports karein
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { getAppConfig } from './config/app.config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const config = getAppConfig();

  const app = await NestFactory.create(AppModule, {
    logger:
      config.nodeEnv === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable CORS
  app.enableCors();

  // Start server
  await app.listen(config.port || 3000);

  logger.log(`🚀 Application running on port ${config.port}`);
  logger.log(`📊 Environment: ${config.nodeEnv}`);
  logger.log(
    `⚡ Batch size: ${config.batchSize}, Flush interval: ${config.flushIntervalMs}ms`,
  );
}

// bootstrap ko sahi se call karein
bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
});
