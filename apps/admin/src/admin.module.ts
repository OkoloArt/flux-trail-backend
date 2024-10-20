import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'libs/utils/env';

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGODB_URI, { dbName: env.MONGODB_DATABASE }),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
