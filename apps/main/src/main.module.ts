import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { UserController } from './controllers/user/user.controller';

@Module({
  imports: [],
  controllers: [AuthController, UserController],
  providers: [],
})
export class MainModule {}
