import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from 'modules/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get a random greeting' })
  @Get('/name')
  async getName(): Promise<string> {
    return this.userService.sayHello();
  }
}
