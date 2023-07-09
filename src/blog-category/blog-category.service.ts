import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { BlogCategory } from '@prisma/client'
import {
  BlogCategoryDto,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
} from 'src/blog-category/dto'
import { checkPermissionOnOthersData, generateSlug } from 'src/utils/helpers'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserRole } from 'src/utils/types/auth'
import {
  PaginationDto,
  PaginationMetaDto,
  PaginationOptionsDto,
} from 'src/shared/dto/pagination'

@Injectable()
export class BlogCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    roles: UserRole[],
    createBlogCategoryDto: CreateBlogCategoryDto
  ): Promise<BlogCategoryDto> {
    try {
      const slug = generateSlug(createBlogCategoryDto.title)
      const createdBlogCategory = await this.prisma.blogCategory.create({
        data: {
          title: createBlogCategoryDto.title,
          slug,
          createdById: userId,
        },
      })
      delete createdBlogCategory.createdById
      return createdBlogCategory
    } catch (error) {
      // console.error(error)
      throw error
    }
  }

  async update(
    userId: number,
    roles: string[],
    categoryId: number,
    updateBlogCategoryDto: UpdateBlogCategoryDto
  ): Promise<BlogCategoryDto> {
    const foundBlogCategory = await this.prisma.blogCategory.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!foundBlogCategory) {
      throw new NotFoundException('Blog Category not found')
    }

    const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roles)
    const isNotCreatedByThisUser = foundBlogCategory.createdById !== userId

    if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
      throw new ForbiddenException('Forbidden resource')
    }

    const slug = generateSlug(updateBlogCategoryDto.title)
    const updatedBlogCategory = await this.prisma.blogCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        title: updateBlogCategoryDto.title,
        slug,
      },
    })
    delete updatedBlogCategory.createdById
    return updatedBlogCategory
  }

  async findAll(
    paginationOptions: PaginationOptionsDto
  ): Promise<PaginationDto<BlogCategory>> {
    let blogCategories: BlogCategory[]
    let total: number

    if (paginationOptions.search) {
      blogCategories = await this.prisma.blogCategory.findMany({
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
      total = await this.prisma.blogCategory.count({
        where: {
          title: {
            search: paginationOptions.search,
          },
        },
      })
    } else {
      blogCategories = await this.prisma.blogCategory.findMany({
        take: paginationOptions.perPage,
        skip: paginationOptions.skip,
        orderBy: {
          [paginationOptions.orderBy]: paginationOptions.order,
        },
      })
      total = await this.prisma.blogCategory.count()
    }

    const paginationMeta = new PaginationMetaDto({
      total,
      paginationOptionsDto: paginationOptions,
    })
    const paginatedResponse = new PaginationDto(blogCategories, paginationMeta)
    return paginatedResponse
  }

  async findOne(id: number): Promise<BlogCategoryDto> {
    const foundBlogCategory = await this.prisma.blogCategory.findUnique({
      where: {
        id,
      },
    })
    if (!foundBlogCategory) {
      throw new NotFoundException('Blog Category not found')
    }
    delete foundBlogCategory.createdById
    return foundBlogCategory
  }

  async remove(userId: number, categoryId: number): Promise<void> {
    try {
      const foundBlogCategory = await this.prisma.blogCategory.findUnique({
        where: {
          id: categoryId,
        },
      })

      if (!foundBlogCategory) {
        throw new NotFoundException('Blog Category not found')
      }

      if (foundBlogCategory.createdById !== userId) {
        throw new ForbiddenException(
          'You are not authorized to delete this blog category'
        )
      }
      await this.prisma.blogCategory.delete({
        where: {
          id: categoryId,
        },
      })
    } catch (error) {
      // console.error(error)
      throw error
    }
  }

  async removeMany(userId: number, categoryIds: number[]): Promise<void> {
    if (categoryIds.length === 0) {
      throw new BadRequestException('You must provide at least one category id')
    }

    try {
      const foundBlogCategories = await this.prisma.blogCategory.findMany({
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

      const foundBlogCategoryIds = foundBlogCategories.map(
        (category) => category.id
      )

      const missingBlogCategoryIds = categoryIds.filter(
        (categoryId) => !foundBlogCategoryIds.includes(categoryId)
      )

      if (foundBlogCategories.length !== categoryIds.length) {
        const errorMessage = `Blog Category not found: ${missingBlogCategoryIds.join(
          ' '
        )}`
        throw new NotFoundException(errorMessage)
      }

      await this.prisma.blogCategory.deleteMany({
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
      // console.error(error)
      throw error
    }
  }
}
