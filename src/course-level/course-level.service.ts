import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CourseLevel } from '@prisma/client'
import {
  CourseLevelDto,
  CreateCourseLevelDto,
  UpdateCourseLevelDto,
} from 'src/course-level/dto'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  PaginationDto,
  PaginationMetaDto,
  PaginationOptionsDto,
} from 'src/shared/dto/pagination'
import { checkPermissionOnOthersData } from 'src/utils/helpers'

@Injectable()
export class CourseLevelService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createCourseLevelDto: CreateCourseLevelDto
  ): Promise<CourseLevelDto> {
    try {
      const createdCourseLevel = await this.prisma.courseLevel.create({
        data: {
          title: createCourseLevelDto.title,
          createdById: userId,
        },
      })
      return createdCourseLevel
    } catch (error) {
      throw error
    }
  }

  async update(
    userId: number,
    roles: string[],
    LevelId: number,
    updateCourseLevelDto: UpdateCourseLevelDto
  ): Promise<CourseLevelDto> {
    const foundCourseLevel = await this.prisma.courseLevel.findUnique({
      where: {
        id: LevelId,
      },
    })

    if (!foundCourseLevel) {
      throw new NotFoundException('Course Level not found')
    }

    const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roles)
    const isNotCreatedByThisUser = foundCourseLevel.createdById !== userId

    if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
      throw new ForbiddenException('Forbidden resource')
    }

    const updatedCourseLevel = await this.prisma.courseLevel.update({
      where: {
        id: LevelId,
      },
      data: {
        title: updateCourseLevelDto.title,
      },
    })
    return updatedCourseLevel
  }

  async findAll(
    paginationOptions: PaginationOptionsDto
  ): Promise<PaginationDto<CourseLevel>> {
    let courseLevels: CourseLevel[]
    let total: number

    if (paginationOptions.search) {
      courseLevels = await this.prisma.courseLevel.findMany({
        take: paginationOptions.perPage,
        skip: paginationOptions.skip,
        orderBy: {
          [paginationOptions.orderBy]: paginationOptions.order,
        },
        where: {
          title: {
            search: paginationOptions.search,
          },
        },
      })
      total = await this.prisma.courseLevel.count({
        where: {
          title: {
            search: paginationOptions.search,
          },
        },
      })
    } else {
      courseLevels = await this.prisma.courseLevel.findMany({
        take: paginationOptions.perPage,
        skip: paginationOptions.skip,
        orderBy: {
          [paginationOptions.orderBy]: paginationOptions.order,
        },
      })
      total = await this.prisma.courseLevel.count()
    }

    const paginationMeta = new PaginationMetaDto({
      total,
      paginationOptionsDto: paginationOptions,
    })
    const paginatedResponse = new PaginationDto(courseLevels, paginationMeta)
    return paginatedResponse
  }

  async findOne(id: number): Promise<CourseLevelDto> {
    const foundCourseLevel = await this.prisma.courseLevel.findUnique({
      where: {
        id,
      },
    })
    if (!foundCourseLevel) {
      throw new NotFoundException('Course Level not found')
    }
    return foundCourseLevel
  }

  async remove(
    userId: number,
    roles: string[],
    LevelId: number
  ): Promise<void> {
    try {
      const foundCourseLevel = await this.prisma.courseLevel.findUnique({
        where: {
          id: LevelId,
        },
      })
      if (!foundCourseLevel) {
        throw new NotFoundException('Course Level not found')
      }

      const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roles)
      const isNotCreatedByThisUser = foundCourseLevel.createdById !== userId

      if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
        throw new ForbiddenException(
          'You are not authorized to delete this course Level'
        )
      }
      await this.prisma.courseLevel.delete({
        where: {
          id: LevelId,
        },
      })
    } catch (error) {
      throw error
    }
  }

  async removeMany(
    userId: number,
    roles: string[],
    LevelIds: number[]
  ): Promise<void> {
    if (LevelIds.length === 0) {
      throw new BadRequestException('You must provide at least one Level id')
    }

    try {
      const foundCourseLevels = await this.prisma.courseLevel.findMany({
        where: {
          AND: [
            {
              id: {
                in: LevelIds,
              },
            },
            {
              createdById: userId,
            },
          ],
        },
      })

      const foundCourseLevelIds = foundCourseLevels.map((Level) => Level.id)

      const missingCourseLevelIds = LevelIds.filter(
        (LevelId) => !foundCourseLevelIds.includes(LevelId)
      )

      if (foundCourseLevels.length !== LevelIds.length) {
        const errorMessage = `Course Level not found: ${missingCourseLevelIds.join(
          ' '
        )}`
        throw new NotFoundException(errorMessage)
      }

      const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roles)
      const isNotCreatedByThisUser = !foundCourseLevels.some(
        (Level) => Level.createdById !== userId
      )

      if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
        throw new ForbiddenException(
          'You are not authorized to delete one/many of these course Levels'
        )
      }

      await this.prisma.courseLevel.deleteMany({
        where: {
          AND: [
            {
              id: {
                in: LevelIds,
              },
            },
            {
              createdById: userId,
            },
          ],
        },
      })
    } catch (error) {
      throw error
    }
  }
}
