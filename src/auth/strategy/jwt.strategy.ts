import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    // If used in super should not use private. super else called before everything else
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, //For testing purpose true otherwise must be false
      secretOrKey: config.get('JWT_SECRET'),
    })
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      include: {
        roles: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    delete user.password
    return user
  }
}
