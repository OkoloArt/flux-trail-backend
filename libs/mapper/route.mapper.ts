import { RouteDto } from 'libs/dto';
import { IdObject } from 'libs/interfaces/mongoose.interface';
import { Route } from 'libs/schema/route.schema';

export const toRouteDto = (route: Route & IdObject): RouteDto => {
  return {
    id: route._id.toString(),
    createdAt: route.createdAt,
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
