import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from 'libs/constants/jwt-constants';
import { FluxTrailAdminService } from 'modules/flux-trail/flux-trail-admin.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private readonly adminService: FluxTrailAdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.adminSecret,
    });
  }

  async validate(payload: any) {
    try {
      const admin = await this.adminService.validateAuthTransaction(
        payload.authTxnBase64,
      );
      return admin;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
