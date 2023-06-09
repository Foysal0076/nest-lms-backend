import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CourseCategory } from '@prisma/client'
import {
  CourseCategoryDto,
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
} from 'src/course-category/dto'
import { generateSlug } from 'src/utils/helpers'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserRole } from 'src/utils/types/auth'
import {
  PaginationDto,
  PaginationMetaDto,
  PaginationOptionsDto,
} from 'src/shared/dto/pagination'

@Injectable()
export class CourseCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    roles: UserRole[],
    createCourseCategoryDto: CreateCourseCategoryDto
  ): Promise<CourseCategoryDto> {
    try {
      const slug = generateSlug(createCourseCategoryDto.title)
      const createdCourseCategory = await this.prisma.courseCategory.create({
        data: {
          title: createCourseCategoryDto.title,
          slug,
          createdById: userId,
        },
      })
      return createdCourseCategory
    } catch (error) {
      throw error
    }
  }

  async update(
    userId: number,
    roles: string[],
    categoryId: number,
    updateCourseCategoryDto: UpdateCourseCategoryDto
  ): Promise<CourseCategoryDto> {
    const foundCourseCategory = await this.prisma.courseCategory.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!foundCourseCategory) {
      throw new NotFoundException('Course Category not found')
    }

    if (foundCourseCategory.createdById !== userId) {
      throw new ForbiddenException('Forbidden resource')
    }

    const slug = generateSlug(updateCourseCategoryDto.title)
    const updatedCourseCategory = await this.prisma.courseCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        title: updateCourseCategoryDto.title,
        slug,
      },
    })
    return updatedCourseCategory
  }

  async findAll(
    paginationOptions: PaginationOptionsDto
  ): Promise<PaginationDto<CourseCategory>> {
    let courseCategories: CourseCategory[]
    let total: number

    if (paginationOptions.search) {
      courseCategories = await this.prisma.courseCategory.findMany({
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
      total = await this.prisma.courseCategory.count({
        where: {
          title: {
            search: paginationOptions.search,
          },
        },
      })
    } else {
      courseCategories = await this.prisma.courseCategory.findMany({
        take: paginationOptions.perPage,
        skip: paginationOptions.skip,
        orderBy: {
          [paginationOptions.orderBy]: paginationOptions.order,
        },
      })
      total = await this.prisma.courseCategory.count()
    }

    const paginationMeta = new PaginationMetaDto({
      total,
      paginationOptionsDto: paginationOptions,
    })
    const paginatedResponse = new PaginationDto(
      courseCategories,
      paginationMeta
    )
    return paginatedResponse
  }

  async findOne(id: number): Promise<CourseCategoryDto> {
    const foundCourseCategory = await this.prisma.courseCategory.findUnique({
      where: {
        id,
      },
    })
    if (!foundCourseCategory) {
      throw new NotFoundException('Course Category not found')
    }
    return foundCourseCategory
  }

  async remove(userId: number, categoryId: number): Promise<void> {
    try {
      const foundCourseCategory = await this.prisma.courseCategory.findUnique({
        where: {
          id: categoryId,
        },
      })
      if (!foundCourseCategory) {
        throw new NotFoundException('Course Category not found')
      }
      if (foundCourseCategory.createdById !== userId) {
        throw new ForbiddenException(
          'You are not authorized to delete this course category'
        )
      }
      await this.prisma.courseCategory.delete({
        where: {
          id: categoryId,
        },
      })
    } catch (error) {
      throw error
    }
  }

  async removeMany(userId: number, categoryIds: number[]): Promise<void> {
    if (categoryIds.length === 0) {
      throw new BadRequestException('You must provide at least one category id')
    }

    try {
      const foundCourseCategories = await this.prisma.courseCategory.findMany({
        where: {
          AND: [
            {
              id: {
                in: categoryIds,
              },
            },
            {
              createdById: userId,
            },
          ],
        },
      })

      const foundCourseCategoryIds = foundCourseCategories.map(
        (category) => category.id
      )

      const missingCourseCategoryIds = categoryIds.filter(
        (categoryId) => !foundCourseCategoryIds.includes(categoryId)
      )

      if (foundCourseCategories.length !== categoryIds.length) {
        const errorMessage = `Course Category not found: ${missingCourseCategoryIds.join(
          ' '
        )}`
        throw new NotFoundException(errorMessage)
      }

      await this.prisma.courseCategory.deleteMany({
        where: {
          AND: [
            {
              id: {
                in: categoryIds,
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

  private deleteOne = async (
    userId: number,
    categoryId: number
  ): Promise<void> => {
    const foundCourseCategory = await this.prisma.courseCategory.findUnique({
      where: {
        id: categoryId,
      },
    })
    if (!foundCourseCategory) {
      throw new NotFoundException('Course Category not found')
    }
    if (foundCourseCategory.createdById !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this course category'
      )
    }
    await this.prisma.courseCategory.delete({
      where: {
        id: categoryId,
      },
    })
  }
}
