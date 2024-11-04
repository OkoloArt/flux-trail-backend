import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
  Request,
  Post,
  UseGuards,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FluxTrailLoginDto,
  CreateRouteDto,
  RouteDto,
  PaginationResponseDto,
  PageOptionsWithSearchDto,
  UpdateRouteDto,
  TicketDto,
  TicketsTransactionsStatisticsDto,
} from 'libs/dto';
import { AdminJwtAuthGuard } from 'libs/guards/jwt/admin-jwt-auth.guard';
import { AdminLocalAuthGuard } from 'libs/guards/local/admin-local-auth.guard';
import { FluxTrailAdminService } from 'modules/flux-trail/flux-trail-admin.service';

@ApiTags('Flux Trail Admin')
@Controller('flux-trail/admin')
@UseInterceptors(ClassSerializerInterceptor)
export class FluxTrailAdminController {
  constructor(private readonly fluxTrailAdminService: FluxTrailAdminService) {}

  @ApiOperation({ summary: 'Sign into admin account' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: FluxTrailLoginDto })
  @UseGuards(AdminLocalAuthGuard)
  @Post('auth/login')
  logInAdmin(@Request() req: any) {
    return this.fluxTrailAdminService.loginAdmin(req.body);
  }

  @ApiOperation({ summary: 'Create new route' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: CreateRouteDto })
  @ApiResponse({ type: RouteDto })
  @UseGuards(AdminJwtAuthGuard)
  @Post('route')
  createRoute(@Body() dto: CreateRouteDto) {
    return this.fluxTrailAdminService.createRoute(dto);
  }

  @ApiOperation({ summary: 'Get an existing route by id' })
  @ApiBearerAuth('Bearer')
  @UseGuards(AdminJwtAuthGuard)
  @ApiResponse({ type: RouteDto })
  @Get('route/:id')
  getRoute(@Param('id') id: string) {
    return this.fluxTrailAdminService.getRouteById(id);
  }

  @ApiOperation({ summary: 'Get all routes' })
  @ApiBearerAuth('Bearer')
  @UseGuards(AdminJwtAuthGuard)
  @ApiResponse({ type: [PaginationResponseDto<RouteDto>] })
  @Get('routes')
  getAllRoute(@Query() options: PageOptionsWithSearchDto) {
    return this.fluxTrailAdminService.getAllRoutes(options);
  }

  @ApiOperation({ summary: 'Update an existing route' })
  @ApiBearerAuth('Bearer')
  @ApiBody({ type: UpdateRouteDto })
  @UseGuards(AdminJwtAuthGuard)
  @ApiResponse({ type: RouteDto })
  @Patch('route/:id')
  updateRoute(@Body() dto: UpdateRouteDto, @Param('id') id: string) {
    return this.fluxTrailAdminService.updateRoute(id, dto);
  }

  @ApiOperation({ summary: 'Delete an existing route' })
  @ApiBearerAuth('Bearer')
  @UseGuards(AdminJwtAuthGuard)
  @Delete('route/:id')
  deleteRoute(@Param('id') id: string) {
    return this.fluxTrailAdminService.deleteRoute(id);
  }

  @ApiOperation({ summary: 'Get an existing ticket by id' })
  @ApiBearerAuth('Bearer')
  @UseGuards(AdminJwtAuthGuard)
  @ApiResponse({ type: TicketDto })
  @Get('ticket/:id')
  getTicket(@Param('id') id: string) {
    return this.fluxTrailAdminService.getTicketById(id);
  }

  @ApiOperation({ summary: 'Get all tickets' })
  @ApiBearerAuth('Bearer')
  @UseGuards(AdminJwtAuthGuard)
  @ApiResponse({ type: [PaginationResponseDto<TicketDto>] })
  @Get('tickets')
  getAllTickets(@Query() options: PageOptionsWithSearchDto) {
    return this.fluxTrailAdminService.getAllTickets(options);
  }

  @ApiOperation({ summary: 'Get all tickets statistics' })
  @ApiBearerAuth('Bearer')
  @UseGuards(AdminJwtAuthGuard)
  @ApiResponse({ type: TicketsTransactionsStatisticsDto })
  @Get('tickets/statistics')
  getTicketsStatistics() {
    return this.fluxTrailAdminService.getTransactionsStatistics();
  }
}
