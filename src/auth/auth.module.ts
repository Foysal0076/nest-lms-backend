import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from 'src/auth/strategy'

@Module({
  imports: [JwtModule.register({})], // to use other modules
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
