import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResponseDto, SigninDto, SignupDto } from 'src/auth/dto'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Signup' })
  @ApiCreatedResponse({ description: 'Signup', type: AuthResponseDto })
  signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(signupDto)
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Signin' })
  @ApiOkResponse({
    description: 'User will get an access token',
    type: AuthResponseDto,
  }) // Swagger will auto generate the response schema from the return type even though we don't include @ApiResponse
  signin(@Body() signupDto: SigninDto): Promise<AuthResponseDto> {
    return this.authService.signin(signupDto)
  }
}
