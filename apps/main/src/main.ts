import { NestFactory, Reflector } from '@nestjs/core';
import { MainModule } from './main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { env } from 'process';

const appName = 'main';
const logger = new Logger(`main.${appName}.bootstrap`);
const port = env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(MainModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('Flux Trail')
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
