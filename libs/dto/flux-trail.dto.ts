import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TRANSPORT_MEDIUM } from 'libs/enums/route.enum';

export class FluxTrailAdminDto {
  @ApiProperty()
  address: string;
}

export class FluxTrailLoginDto {
  @ApiProperty()
  authTxnBase64: string;
}

export class CreateRouteDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  appId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    enum: TRANSPORT_MEDIUM,
    default: TRANSPORT_MEDIUM.BUS,
  })
  @IsEnum(TRANSPORT_MEDIUM)
  @IsNotEmpty()
  transportMedium: TRANSPORT_MEDIUM;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fromStateCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fromTerminal: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  toStateCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  toTerminal: string;
}

export class RouteDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  appId: number;

  @ApiProperty()
  price: number;

  @ApiProperty({
    enum: TRANSPORT_MEDIUM,
  })
  transportMedium: TRANSPORT_MEDIUM;

  @ApiProperty()
  from: string;

  @ApiProperty()
  fromStateCode: string;

  @ApiProperty()
  fromTerminal: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  toStateCode: string;

  @ApiProperty()
  toTerminal: string;
}

export class UpdateRouteDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  appId?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    enum: TRANSPORT_MEDIUM,
    default: TRANSPORT_MEDIUM.BUS,
  })
  @IsEnum(TRANSPORT_MEDIUM)
  @IsOptional()
  transportMedium?: TRANSPORT_MEDIUM;

  @ApiProperty()
  @IsString()
  @IsOptional()
  from?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fromStateCode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fromTerminal?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  to?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  toStateCode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  toTerminal?: string;
}

export class CreateTicketDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  assetId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  buyerAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  routeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  departureDate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numberOfAdults: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numberOfChildren: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numberOfInfants: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ipfsUrl: string;
}

export class UseTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerAddress: string;
}

export class BurnTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerAddress: string;
}

export class TicketDto extends RouteDto {
  @ApiProperty()
  assetId: number;

  @ApiProperty()
  buyerAddress: string;

  @ApiProperty()
  routeId: string;

  @ApiProperty()
  departureDate: string;

  @ApiProperty()
  numberOfAdults: number;

  @ApiProperty()
  numberOfChildren: number;

  @ApiProperty()
  numberOfInfants: number;

  @ApiProperty()
  used: boolean;

  @ApiProperty()
  ipfsUrl: string;
}

export class TicketsTransactionsStatisticsDto {
  @ApiProperty()
  totalTickets: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  totalRoutes: number;
}
