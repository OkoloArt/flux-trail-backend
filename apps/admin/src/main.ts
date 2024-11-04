import { NestFactory, Reflector } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { env } from 'libs/utils/env';

const appName = 'main';
const logger = new Logger(`main.${appName}.bootstrap`);
const port = env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AdminModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Flux Trail Admin')
    .setDescription('API service for FluxTrail.')
    .setVersion('1.0')
    .addTag('flux-trail')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'Bearer', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));

  await app.listen(port, () => {
    logger.log(`--------- Application starts ---------`);
    logger.log(`--------------------------------------`);
    logger.log(`Listening on port: ${port} for the ${appName} app`);
  });
}
bootstrap();
