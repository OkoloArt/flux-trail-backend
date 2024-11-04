/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlgorandService } from '../algorand/algorand.service';
import {
  CreateTicketDto,
  TicketDto,
  UseTicketDto,
  BurnTicketDto,
  PageOptionsWithSearchDto,
  PaginationResponseDto,
  PageMetaDto,
  RouteDto,
} from 'libs/dto';
import { Order } from 'libs/enums';
import { toRouteDto } from 'libs/mapper/route.mapper';
import { toTicketDto } from 'libs/mapper/ticket.mapper';
import { Route, RouteDocument } from 'libs/schema/route.schema';
import { Ticket, TicketDocument } from 'libs/schema/ticket.schema';
import { createPageOptionFallBack } from 'libs/utils/createPageOptionFallBack';

@Injectable()
export class FluxTrailService {
  private readonly logger = new Logger(FluxTrailService.name);

  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    private readonly algorandService: AlgorandService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async createTicket(dto: CreateTicketDto): Promise<TicketDto> {
    const existingTicket = await this.ticketModel.findOne({
      assetId: dto.assetId,
    });

    if (existingTicket) {
      throw new ForbiddenException('Ticket already exists');
    }

    const route = await this.routeModel.findById(dto.routeId);

    if (!route) {
      throw new ForbiddenException('Route not found');
    }

    const assetExists = await this.algorandService.checkIfAssetExists(
      String(dto.assetId),
    );

    if (!assetExists) {
      throw new BadRequestException(
        'The asset id for this ticket does not belong to any existing ASA',
      );
    }

    const addressIsValid = await this.algorandService.validateWalletAddress(
      dto.buyerAddress,
    );

    if (!addressIsValid) {
      throw new BadRequestException('Invalid buyer address');
    }

    const addressHasAsset = await this.algorandService.checkIfAccountHasAsset(
      dto.buyerAddress,
      String(dto.assetId),
    );

    if (!addressHasAsset) {
      throw new ForbiddenException(
        'The buyer address does not have the required ASA in their wallet',
      );
    }

    const ticket = new this.ticketModel({
      assetId: dto.assetId,
      buyerAddress: dto.buyerAddress,
      routeId: dto.routeId,
      departureDate: dto.departureDate,
      numberOfAdults: Number(dto.numberOfAdults),
      numberOfChildren: Number(dto.numberOfChildren),
      numberOfInfants: Number(dto.numberOfInfants),
      used: false,
      ipfsUrl: dto.ipfsUrl,
    });

    const savedTicket = await ticket.save();

    return toTicketDto(savedTicket, route);
  }

  async getTicketById(id: string): Promise<TicketDto> {
    const ticket = await this.ticketModel.findById(id);

    if (!ticket) {
      throw new ForbiddenException('Ticket not found');
    }

    const route = await this.routeModel.findById(ticket.routeId);

    if (!route) {
      throw new ForbiddenException('Route not found');
    }

    return toTicketDto(ticket, route);
  }

  async getTicketByAsaId(assetId: number): Promise<TicketDto> {
    const ticket = await this.ticketModel.findOne({
      assetId,
      deleted: false,
    });

    if (!ticket) {
      throw new ForbiddenException('Ticket not found');
    }

    const route = await this.routeModel.findById(ticket.routeId);

    if (!route) {
      throw new ForbiddenException('Route not found');
    }

    return toTicketDto(ticket, route);
  }

  async useTicket(dto: UseTicketDto): Promise<TicketDto> {
    const ticket = await this.ticketModel.findById(dto.ticketId);

    if (!ticket) {
      throw new ForbiddenException('Ticket not found');
    }

    if (ticket.used) {
      throw new ForbiddenException('Ticket has already been used');
    }

    const addressHasAsset = await this.algorandService.checkIfAccountHasAsset(
      dto.ownerAddress,
      String(ticket.assetId),
    );

    if (!addressHasAsset) {
      throw new ForbiddenException(
        'Only the holder of this asset can use this ticket',
      );
    }

    ticket.used = true;

    const updatedTicket = await ticket.save();

    const route = await this.routeModel.findById(ticket.routeId);

    if (!route) {
      throw new ForbiddenException('Route not found');
    }

    return toTicketDto(updatedTicket, route);
  }

  async burnTicket(dto: BurnTicketDto): Promise<any> {
    const ticket = await this.ticketModel.findById(dto.ticketId);

    if (!ticket) {
      throw new ForbiddenException('Ticket not found');
    }

    const assetExists = await this.algorandService.checkIfAssetExists(
      String(ticket.assetId),
    );

    if (assetExists) {
      throw new ForbiddenException(
        'You cannot burn this asset if the asset still exists on the blockchain',
      );
    }

    await this.ticketModel.findByIdAndUpdate(dto.ticketId, { deleted: true });

    return { message: 'Ticket burned successfully' };
  }

  async getAllTickets(
    buyerAddress: string,
    options: PageOptionsWithSearchDto,
  ): Promise<PaginationResponseDto<TicketDto>> {
    const pageOptionsDtoFallBack = createPageOptionFallBack(options);
    const { order, skip, numOfItemsPerPage, searchTerm, used } =
      pageOptionsDtoFallBack;

    if (order !== Order.ASC && order !== Order.DESC) {
      throw new BadRequestException('Order must be either "asc" or "desc"');
    }

    const query: any = {
      buyerAddress,
      deleted: false,
    };

    if (!!used) {
      query.used = used === 'true';
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

  async getAllRoutes(): Promise<RouteDto[]> {
    const routes = await this.routeModel.find();

    return routes.map((route) => toRouteDto(route));
  }
}
