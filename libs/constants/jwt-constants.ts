import { env } from 'libs/utils/env';

export const jwtConstants = {
  secret: env.JWT_SECRET || 'shabasjulapulla',
  adminSecret: env.ADMIN_JWT_SECRET || 'hunternsssunter',
};
