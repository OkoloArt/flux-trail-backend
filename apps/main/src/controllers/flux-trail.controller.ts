import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTicketDto,
  TicketDto,
  UseTicketDto,
  BurnTicketDto,
  PaginationResponseDto,
  PageOptionsWithSearchDto,
  RouteDto,
} from 'libs/dto';
import { FluxTrailService } from 'modules/flux-trail/flux-trail.service';

@ApiTags('Flux Trail')
@Controller('flux-trail')
@UseInterceptors(ClassSerializerInterceptor)
export class FluxTrailController {
  constructor(private readonly fluxTrailService: FluxTrailService) {}

  @ApiOperation({ summary: 'Create new ticket' })
  @ApiBody({ type: CreateTicketDto })
  @ApiResponse({ type: TicketDto })
  @Post('ticket')
  createTicket(@Body() dto: CreateTicketDto) {
    return this.fluxTrailService.createTicket(dto);
  }

  @ApiOperation({ summary: 'Use a ticket' })
  @ApiBody({ type: UseTicketDto })
  @ApiResponse({ type: TicketDto })
  @Post('ticket/use')
  useTicker(@Body() dto: UseTicketDto) {
    return this.fluxTrailService.useTicket(dto);
  }

  @ApiOperation({ summary: 'Burn a ticket' })
  @ApiBody({ type: BurnTicketDto })
  @Delete('ticket/burn')
  deleteTicket(@Body() dto: BurnTicketDto) {
    return this.fluxTrailService.burnTicket(dto);
  }

  @ApiOperation({ summary: 'Get an existing ticket by asset id' })
  @ApiResponse({ type: TicketDto })
  @Get('ticket/:assetId')
  getTicket(@Param('assetId') id: number) {
    return this.fluxTrailService.getTicketByAsaId(id);
  }

  @ApiOperation({ summary: 'Get all tickets under an address' })
  @ApiResponse({ type: [PaginationResponseDto<TicketDto>] })
  @Get('tickets/:address')
  getAllTickets(
    @Param('address') address: string,
    @Query() options: PageOptionsWithSearchDto,
  ) {
    return this.fluxTrailService.getAllTickets(address, options);
  }

  @ApiOperation({ summary: 'Get all avaliable routes' })
  @ApiResponse({ type: RouteDto, isArray: true })
  @Get('routes')
  getAllRoutes() {
    return this.fluxTrailService.getAllRoutes();
  }
}
