import { TicketDto } from 'libs/dto';
import { IdObject } from 'libs/interfaces/mongoose.interface';
import { Route } from 'libs/schema/route.schema';
import { Ticket } from 'libs/schema/ticket.schema';

export const toTicketDto = (
  ticket: Ticket & IdObject,
  route: Route & IdObject,
): TicketDto => {
  return {
    id: ticket._id.toString(),
    createdAt: ticket.createdAt,
    assetId: ticket.assetId,
    buyerAddress: ticket.buyerAddress,
    routeId: route._id.toString(),
    departureDate: ticket.departureDate,
    numberOfAdults: ticket.numberOfAdults,
    numberOfChildren: ticket.numberOfChildren,
    numberOfInfants: ticket.numberOfInfants,
    used: ticket.used,
    ipfsUrl: ticket.ipfsUrl,
    appId: route.appId,
    price: route.price,
    transportMedium: route.transportMedium,
    from: route.from,
    fromStateCode: route.fromStateCode,
    fromTerminal: route.fromTerminal,
    to: route.to,
    toStateCode: route.toStateCode,
    toTerminal: route.toTerminal,
  };
};
