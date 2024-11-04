import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import algosdk from 'algosdk';
import { JwtService } from '@nestjs/jwt';
import { ed25519 } from '@noble/curves/ed25519';
import { Model } from 'mongoose';
import {
  FluxTrailAdminDto,
  CreateRouteDto,
  RouteDto,
  PageOptionsWithSearchDto,
  PaginationResponseDto,
  PageMetaDto,
  UpdateRouteDto,
  TicketDto,
  TicketsTransactionsStatisticsDto,
} from 'libs/dto';
import { Order } from 'libs/enums';
import { toRouteDto } from 'libs/mapper/route.mapper';
import { toTicketDto } from 'libs/mapper/ticket.mapper';
import { Route, RouteDocument } from 'libs/schema/route.schema';
import { Ticket, TicketDocument } from 'libs/schema/ticket.schema';
import { createPageOptionFallBack } from 'libs/utils/createPageOptionFallBack';
import { env } from 'libs/utils/env';

@Injectable()
export class FluxTrailAdminService {
  private readonly logger = new Logger(FluxTrailAdminService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async validateAuthTransaction(txnBase64: string): Promise<FluxTrailAdminDto> {
    try {
      const txnByteArray = new Uint8Array(Buffer.from(txnBase64, 'base64'));
      const decodedTxn = algosdk.decodeSignedTransaction(txnByteArray);

      const from = algosdk.encodeAddress(decodedTxn.txn.sender.publicKey);
      const to = algosdk.encodeAddress(
        decodedTxn.txn.payment?.receiver.publicKey,
      );

      if (from !== to) {
        throw new UnauthorizedException('Invalid auth transaction');
      }

      if (from !== env.FLUX_TRAIL_ADMIN_ADDRESS)
        throw new UnauthorizedException('Unrecognized auth transaction sender');

      const publicKey = algosdk.decodeAddress(
        env.FLUX_TRAIL_ADMIN_ADDRESS,
      ).publicKey;
      const publicKeyHex = Buffer.from(publicKey).toString('hex');

      const isValid = ed25519.verify(
        decodedTxn.sig!,
        decodedTxn.txn!.bytesToSign(),
        new Uint8Array(Buffer.from(publicKeyHex, 'hex')),
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid auth transaction signer');
      } else {
        return {
          address: env.FLUX_TRAIL_ADMIN_ADDRESS,
        };
      }
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid auth transaction');
    }
  }

  async loginAdmin(admin: FluxTrailAdminDto) {
    return {
      accessToken: this.jwtService.sign(admin, { expiresIn: 86400 }),
      expiresIn: 86400,
    };
  }

  async createRoute(createRouteDto: CreateRouteDto): Promise<RouteDto> {
    const existingRoute = await this.routeModel.findOne({
      appId: createRouteDto.appId,
    });

    if (existingRoute) {
      throw new ConflictException('Route already exists');
    }

    const route = new this.routeModel(createRouteDto);
    const createdRoute = await route.save();

    return toRouteDto(createdRoute);
  }

  async getRouteById(id: string): Promise<RouteDto> {
    const route = await this.routeModel.findById(id);

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return toRouteDto(route);
  }

  async getAllRoutes(
    options: PageOptionsWithSearchDto,
  ): Promise<PaginationResponseDto<RouteDto>> {
    const pageOptionsDtoFallBack = createPageOptionFallBack(options);
    const { order, skip, numOfItemsPerPage, searchTerm } =
      pageOptionsDtoFallBack;

    if (order !== Order.ASC && order !== Order.DESC) {
      throw new BadRequestException('Order must be either "asc" or "desc"');
    }

    const query: any = {};

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' };
    }

    const [allRoutes, itemCount] = await Promise.all([
      this.routeModel
        .find(query)
        .sort({ createdAt: order === Order.ASC ? 1 : -1 })
        .skip(skip)
        .limit(numOfItemsPerPage)
        .exec(),
      this.routeModel.countDocuments(query).exec(),
    ]);

    const routes: RouteDto[] = allRoutes.map((route) => toRouteDto(route));

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptionsDtoFallBack,
    });

    return {
      data: routes,
      pagination: pageMetaDto,
    };
  }

  async updateRoute(
    id: string,
    updateRouteDto: UpdateRouteDto,
  ): Promise<RouteDto> {
    const route = await this.routeModel.findByIdAndUpdate(id, updateRouteDto, {
      new: true,
    });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return toRouteDto(route);
  }

  async deleteRoute(id: string): Promise<any> {
    const result = await this.routeModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Route not found');
    }

    return { message: 'Route deleted successfully' };
  }

  async getTicketById(id: string): Promise<TicketDto> {
    const ticket = await this.ticketModel.findById(id);

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const route = await this.routeModel.findById(ticket.routeId);

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return toTicketDto(ticket, route);
  }

  async getAllTickets(
    options: PageOptionsWithSearchDto,
  ): Promise<PaginationResponseDto<TicketDto>> {
    const pageOptionsDtoFallBack = createPageOptionFallBack(options);
    const { order, skip, numOfItemsPerPage, searchTerm } =
      pageOptionsDtoFallBack;

    if (order !== Order.ASC && order !== Order.DESC) {
      throw new BadRequestException('Order must be either "asc" or "desc"');
    }

    const query: any = {};

    if (searchTerm) {
      query.title = { $regex: searchTerm, $options: 'i' };
    }

    const [allTickets, itemCount] = await Promise.all([
      this.ticketModel
        .find(query)
        .sort({ createdAt: order === Order.ASC ? 1 : -1 })
        .skip(skip)
        .limit(numOfItemsPerPage)
        .exec(),
      this.ticketModel.countDocuments(query).exec(),
    ]);

    const tickets: TicketDto[] = [];

    for (const ticket of allTickets) {
      const route = await this.routeModel.findById(ticket.routeId);

      if (!route) {
        continue;
      }

      tickets.push(toTicketDto(ticket, route));
    }

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: pageOptionsDtoFallBack,
    });

    return {
      data: tickets,
      pagination: pageMetaDto,
    };
  }

  async getTransactionsStatistics(): Promise<TicketsTransactionsStatisticsDto> {
    const totalTickets = await this.ticketModel.countDocuments();
    const totalRoutes = await this.routeModel.countDocuments();

    const allTickets = await this.ticketModel.find().exec();

    let totalRevenue = 0;

    for (const ticket of allTickets) {
      const route = await this.routeModel.findById(ticket.routeId);

      if (!route) {
        continue;
      }

      totalRevenue +=
        route.price *
        (ticket.numberOfAdults +
          ticket.numberOfChildren +
          ticket.numberOfInfants);
    }

    return {
      totalRevenue,
      totalTickets,
      totalRoutes,
    };
  }
}
