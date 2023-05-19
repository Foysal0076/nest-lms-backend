import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UpdateUserDto, UpdateUserResponseDto } from 'src/user/dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto
  ): Promise<UpdateUserResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } })
      if (!user) throw new NotFoundException('User not found')
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { ...updateUserDto },
      })
      delete updatedUser.password
      return updatedUser
    } catch (error) {
      throw error
    }
  }
}
