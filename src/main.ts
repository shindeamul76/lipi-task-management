
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';



function setupSwagger(app) {
  const swaggerDocPath = '/api-docs';

  const config = new DocumentBuilder()
    .setTitle('Task Management API Documentation')
    .setDescription('APIs for Task Management')
    .setVersion('1.0')

    .addApiKey(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT Token',
    )
    .addTag('Task Management')
    .build();
    // .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerDocPath, app, documentFactory, {
    swaggerOptions: { persistAuthorization: true, igonreGlobalPrefix: true },
  });

}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  console.log(`Port: ${configService.get('PORT')}`);


  app.enableCors();

  await setupSwagger(app);


  
  await app.listen(configService.get('PORT')  || 3000);

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.info('SIGTERM signal received');
      await app.close();
    });
}
bootstrap();