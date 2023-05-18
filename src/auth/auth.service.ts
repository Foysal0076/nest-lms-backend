import { ForbiddenException, Injectable } from '@nestjs/common'
import { AuthResponseDto, SigninDto, SignupDto } from 'src/auth/dto'
import { PrismaService } from 'src/prisma/prisma.service'
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

@Injectable()
export class AuthService {
  prisma: PrismaService
  constructor(
    prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService
  ) {
    this.prisma = prisma
  }

  async signup({
    email,
    password,
    firstName,
    lastName,
  }: SignupDto): Promise<AuthResponseDto> {
    //hash the password
    const hash = await argon.hash(password)

    // save the new user in the db
    try {
      const createdUser = await this.prisma.user.create({
        data: {
          email,
          password: hash,
          firstName,
          lastName,
        },
      })

      return this.signToken(createdUser.id, createdUser.email)
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken')
        }
      }
      throw error
    }
  }

  async signin({ email, password }: SigninDto): Promise<AuthResponseDto> {
    try {
      const foundUser = await this.prisma.user.findUnique({ where: { email } })
      if (!foundUser) {
        throw new ForbiddenException('Invalid credentials')
      }
      const pwMatches = await argon.verify(foundUser.password, password)
      if (!pwMatches) {
        throw new ForbiddenException('Invalid credentials')
      }

      return this.signToken(foundUser.id, foundUser.email)
    } catch (error) {
      throw error
    }
  }

  async signToken(userId: number, email: string): Promise<AuthResponseDto> {
    const payload = { sub: userId, email }
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    })
    return { accessToken }
  }
}
