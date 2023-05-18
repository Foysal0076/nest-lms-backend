import { PickType } from '@nestjs/swagger'
import { SignupDto } from 'src/auth/dto/auth.dto'

export class SigninDto extends PickType(SignupDto, [
  'email',
  'password',
] as const) {}
