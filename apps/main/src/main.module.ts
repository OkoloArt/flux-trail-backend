import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'libs/utils/env';
import { FluxTrailController } from './controllers/flux-trail.controller';
import { FluxTrailModule } from 'modules/flux-trail/flux-trail.module';

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGODB_URI, { dbName: env.MONGODB_DATABASE }),
    FluxTrailModule,
  ],
  controllers: [FluxTrailController],
  providers: [],
})
export class MainModule {}
