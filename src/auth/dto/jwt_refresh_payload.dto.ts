import { JwtPayload } from '.';

export type JwtRefreshPayload = JwtPayload & { refreshToken: string };
