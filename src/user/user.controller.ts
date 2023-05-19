import { Body, Controller, Patch, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { GetUser } from 'src/auth/decorator'
import { JWTAuthGuard } from 'src/auth/guard'
import { UpdateUserDto } from 'src/user/dto'
import { UserService } from 'src/user/user.service'

@ApiTags('User')
@Controller('user')
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
}
