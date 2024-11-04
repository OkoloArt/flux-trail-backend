import { Module } from '@nestjs/common';
import { FluxTrailService } from './flux-trail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FluxTrailAdminService } from './flux-trail-admin.service';
import { JwtModule } from '@nestjs/jwt';
import { AlgorandService } from '../algorand/algorand.service';
import { jwtConstants } from 'libs/constants';
import { JwtAdminStrategy } from 'libs/guards/jwt/jwt-admin.strategy';
import { LocalAdminStrategy } from 'libs/guards/local/local-admin.strategy';
import { Route, RouteSchema } from 'libs/schema/route.schema';
import { Ticket, TicketSchema } from 'libs/schema/ticket.schema';

@Module({
  providers: [
    FluxTrailService,
    FluxTrailAdminService,
    LocalAdminStrategy,
    JwtAdminStrategy,
    AlgorandService,
  ],
  exports: [FluxTrailService, FluxTrailAdminService],
  imports: [
    JwtModule.register({
      secret: jwtConstants.adminSecret,
      signOptions: { expiresIn: '86400s' },
    }),
    MongooseModule.forFeature([
      { name: Route.name, schema: RouteSchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
  ],
})
export class FluxTrailModule {}
