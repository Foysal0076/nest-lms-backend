import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  UpdateProfileDto,
  UpdateSuccessResponse,
  UpdateUserDto,
  UserProfileDto,
} from 'src/user/dto'
import * as argon from 'argon2'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto
  ): Promise<UpdateSuccessResponse> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } })
      if (!user) throw new NotFoundException('User not found')

      //check if object is empty
      if (Object.keys(updateUserDto).length === 0) {
        return { statusCode: HttpStatus.OK, message: 'Nothing to update' }
      }

      if (updateUserDto.password)
        updateUserDto.password = await argon.hash(updateUserDto.password)

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { ...updateUserDto },
      })
      delete updatedUser.password
      return { statusCode: HttpStatus.OK, message: 'Update successful' }
    } catch (error) {
      throw error
    }
  }

  async getUserProfile(userId: number): Promise<UserProfileDto> {
    try {
      const user = await this.prisma.userProfile.findUnique({
        where: { userId },
      })
      return new UserProfileDto(user)
    } catch (error) {
      throw error
    }
  }

  async updateUserProfile(
    userId: number,
    updateUserProfileDto: UpdateProfileDto
  ): Promise<UserProfileDto> {
    try {
      const userProfile = await this.prisma.userProfile.findUnique({
        where: { userId },
      })

      if (!userProfile) throw new NotFoundException('User not found')

      //check if object is empty
      if (Object.keys(updateUserProfileDto).length === 0) {
        throw new BadRequestException('Nothing to update')
      }

      const updatedUserProfile = await this.prisma.userProfile.update({
        where: { userId },
        data: { ...updateUserProfileDto },
      })
      return new UserProfileDto(updatedUserProfile)
    } catch (error) {
      throw error
    }
  }
}
