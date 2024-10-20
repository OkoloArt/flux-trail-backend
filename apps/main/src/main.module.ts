import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { UserController } from './controllers/user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'libs/utils/env';
import { UserModule } from 'modules/user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGODB_URI, { dbName: env.MONGODB_DATABASE }),
    UserModule,
  ],
  controllers: [AuthController, UserController],
  providers: [],
})
export class MainModule {}
