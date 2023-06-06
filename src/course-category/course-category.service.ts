import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CourseCategory } from '@prisma/client'
import {
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
} from 'src/course-category/dto'
import { generateSlug } from 'src/utils/helpers'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserRole } from 'src/utils/types/auth'

@Injectable()
export class CourseCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    roles: UserRole[],
    createCourseCategoryDto: CreateCourseCategoryDto
  ): Promise<CourseCategory> {
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
  ): Promise<CourseCategory> {
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

  findAll() {
    return `This action returns all courseCategory`
  }

  findOne(id: number) {
    return `This action returns a #${id} courseCategory`
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
      throw new NotFoundException('No course category found')
    }
    try {
      categoryIds.forEach(async (categoryId) =>
        this.deleteOne(userId, categoryId)
      )
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
