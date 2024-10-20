import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async sayHello(): Promise<string> {
    return 'Hi, How are you?';
  }
}
