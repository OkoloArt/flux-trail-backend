import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FluxTrailAdminService } from 'modules/flux-trail';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
  Strategy,
  'local-admin',
) {
  constructor(private adminService: FluxTrailAdminService) {
    super({ usernameField: 'authTxnBase64', passwordField: 'authTxnBase64' });
  }

  async validate(authTxnBase64: string): Promise<any> {
    const user = await this.adminService.validateAuthTransaction(authTxnBase64);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
