import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CourseTag } from '@prisma/client'
import {
  CourseTagDto,
  CreateCourseTagDto,
  UpdateCourseTagDto,
} from 'src/course-tag/dto'
import { PrismaService } from 'src/prisma/prisma.service'
import {
  PaginationDto,
  PaginationMetaDto,
  PaginationOptionsDto,
} from 'src/shared/dto/pagination'
import { checkPermissionOnOthersData } from 'src/utils/helpers'

@Injectable()
export class CourseTagService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createCourseTagDto: CreateCourseTagDto
  ): Promise<CourseTagDto> {
    try {
      const createdCourseTag = await this.prisma.courseTag.create({
        data: {
          title: createCourseTagDto.title,
          createdById: userId,
        },
      })
      return createdCourseTag
    } catch (error) {
      throw error
    }
  }

  async update(
    userId: number,
    roles: string[],
    tagId: number,
    updateCourseTagDto: UpdateCourseTagDto
  ): Promise<CourseTagDto> {
    const foundCourseTag = await this.prisma.courseTag.findUnique({
      where: {
        id: tagId,
      },
    })

    if (!foundCourseTag) {
      throw new NotFoundException('Course Tag not found')
    }

    const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roles)
    const isNotCreatedByThisUser = foundCourseTag.createdById !== userId

    if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
      throw new ForbiddenException('Forbidden resource')
    }

    const updatedCourseTag = await this.prisma.courseTag.update({
      where: {
        id: tagId,
      },
      data: {
        title: updateCourseTagDto.title,
      },
    })
    return updatedCourseTag
  }

  async findAll(
    paginationOptions: PaginationOptionsDto
  ): Promise<PaginationDto<CourseTag>> {
    let courseTags: CourseTag[]
    let total: number

    if (paginationOptions.search) {
      courseTags = await this.prisma.courseTag.findMany({
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
      total = await this.prisma.courseTag.count({
        where: {
          title: {
            search: paginationOptions.search,
          },
        },
      })
    } else {
      courseTags = await this.prisma.courseTag.findMany({
        take: paginationOptions.perPage,
        skip: paginationOptions.skip,
        orderBy: {
          [paginationOptions.orderBy]: paginationOptions.order,
        },
      })
      total = await this.prisma.courseTag.count()
    }

    const paginationMeta = new PaginationMetaDto({
      total,
      paginationOptionsDto: paginationOptions,
    })
    const paginatedResponse = new PaginationDto(courseTags, paginationMeta)
    return paginatedResponse
  }

  async findOne(id: number): Promise<CourseTagDto> {
    const foundCourseTag = await this.prisma.courseTag.findUnique({
      where: {
        id,
      },
    })
    if (!foundCourseTag) {
      throw new NotFoundException('Course Tag not found')
    }
    return foundCourseTag
  }

  async remove(userId: number, roles: string[], tagId: number): Promise<void> {
    try {
      const foundCourseTag = await this.prisma.courseTag.findUnique({
        where: {
          id: tagId,
        },
      })
      if (!foundCourseTag) {
        throw new NotFoundException('Course Tag not found')
      }

      const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roles)
      const isNotCreatedByThisUser = foundCourseTag.createdById !== userId

      if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
        throw new ForbiddenException(
          'You are not authorized to delete this Course Tag'
        )
      }
      await this.prisma.courseTag.delete({
        where: {
          id: tagId,
        },
      })
    } catch (error) {
      throw error
    }
  }

  async removeMany(
    userId: number,
    roles: string[],
    tagIds: number[]
  ): Promise<void> {
    if (tagIds.length === 0) {
      throw new BadRequestException('You must provide at least one Tag id')
    }

    try {
      const foundCourseTags = await this.prisma.courseTag.findMany({
        where: {
          AND: [
            {
              id: {
                in: tagIds,
              },
            },
            {
              createdById: userId,
            },
          ],
        },
      })

      const foundCourseTagIds = foundCourseTags.map((Tag) => Tag.id)

      const missingCourseTagIds = tagIds.filter(
        (tagId) => !foundCourseTagIds.includes(tagId)
      )

      if (foundCourseTags.length !== tagIds.length) {
        const errorMessage = `Course Tag not found: ${missingCourseTagIds.join(
          ' '
        )}`
        throw new NotFoundException(errorMessage)
      }

      const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roles)
      const isNotCreatedByThisUser = !foundCourseTags.some(
        (Tag) => Tag.createdById !== userId
      )

      if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
        throw new ForbiddenException(
          'You are not authorized to delete one/many of these course Tags'
        )
      }

      await this.prisma.courseTag.deleteMany({
        where: {
          AND: [
            {
              id: {
                in: tagIds,
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
