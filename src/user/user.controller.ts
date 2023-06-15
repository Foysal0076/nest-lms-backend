import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetUser } from 'src/auth/decorator'
import { JWTAuthGuard } from 'src/auth/guard'
import { UpdateProfileDto, UpdateUserDto } from 'src/user/dto'
import { UserService } from 'src/user/user.service'

@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  async updateUser(
    @GetUser('id') userId: number,
    @Body() updateUserData: UpdateUserDto
  ) {
    return this.userService.updateUser(userId, updateUserData)
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  async getProfile(@GetUser('id') userId: number) {
    return this.userService.getUserProfile(userId)
  }

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  async updateProfile(
    @GetUser('id') userId: number,
    @Body() updateProfileData: UpdateProfileDto
  ) {
    return this.userService.updateUserProfile(userId, updateProfileData)
  }
}
