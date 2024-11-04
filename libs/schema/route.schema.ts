import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from './base.schema';
import { HydratedDocument } from 'mongoose';
import { TRANSPORT_MEDIUM } from 'libs/enums/route.enum';

export type RouteDocument = HydratedDocument<Route>;

@Schema()
export class Route extends Base {
  @ApiProperty()
  @Prop({ default: 0 })
  appId: number;

  @ApiProperty({
    enum: TRANSPORT_MEDIUM,
    default: TRANSPORT_MEDIUM.BUS,
  })
  @Prop({ type: String, default: TRANSPORT_MEDIUM.BUS })
  transportMedium: TRANSPORT_MEDIUM;

  @ApiProperty()
  @Prop()
  from: string;

  @ApiProperty()
  @Prop()
  fromStateCode: string;

  @ApiProperty()
  @Prop()
  fromTerminal: string;

  @ApiProperty()
  @Prop()
  to: string;

  @ApiProperty()
  @Prop()
  toStateCode: string;

  @ApiProperty()
  @Prop()
  toTerminal: string;

  @ApiProperty()
  @Prop()
  price: number;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
