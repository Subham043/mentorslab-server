import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtPayload, JwtRefreshPayload } from '../dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET_KEY || 'secretKey',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtRefreshPayload {
    const refreshToken = req
      ?.get('Authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    const result = this.prismaService.user.findFirst({
      where: {
        id: payload.id,
      },
    });
    if (!result) throw new ForbiddenException('Refresh token malformed');
    return {
      ...payload,
      refreshToken,
    };
  }
}
