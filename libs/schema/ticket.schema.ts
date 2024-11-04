import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from './base.schema';
import { HydratedDocument } from 'mongoose';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema()
export class Ticket extends Base {
  @ApiProperty()
  @Prop({ default: 0 })
  assetId: number;

  @ApiProperty()
  @Prop()
  buyerAddress: string;

  @ApiProperty()
  @Prop()
  routeId: string;

  @ApiProperty()
  @Prop()
  departureDate: string;

  @ApiProperty()
  @Prop({ default: 0 })
  numberOfAdults: number;

  @ApiProperty()
  @Prop({ default: 0 })
  numberOfChildren: number;

  @ApiProperty()
  @Prop({ default: 0 })
  numberOfInfants: number;

  @ApiProperty()
  @Prop({ default: false })
  used: boolean;

  @ApiProperty()
  @Prop()
  ipfsUrl: string;

  @ApiProperty()
  @Prop({ default: false })
  deleted: boolean;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
