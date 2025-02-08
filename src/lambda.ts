import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

let cachedServer;

function setupSwagger(app) {
  const swaggerDocPath = '/api-docs';

  const config = new DocumentBuilder()
    .setTitle('Task Management API Documentation')
    .setDescription('APIs for Task Management')
    .setVersion('1.0')
    .addTag('Task Management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerDocPath, app, document, {
    swaggerOptions: { persistAuthorization: true, ignoreGlobalPrefix: true },
  });
}

export const handler = async (event, context) => {
  if (!cachedServer) {
    const expressApp = express();  
    const nestApp = await NestFactory.create(AppModule, { cors: true });

    nestApp.use(express.json());  
    nestApp.use(express.urlencoded({ extended: true }));

    setupSwagger(nestApp);

    await nestApp.init();

    cachedServer = serverlessExpress({
      app: nestApp.getHttpAdapter().getInstance(),
    });
  }

  return cachedServer(event, context);
};