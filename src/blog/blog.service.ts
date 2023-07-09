import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { checkPermissionOnOthersData, generateSlug } from 'src/utils/helpers'
import { PrismaService } from 'src/prisma/prisma.service'
import { BlogDto } from 'src/blog/dto'
import { Blog, Prisma } from '@prisma/client'
import { ROLES_WITH_SPECIAL_PERMISSIONS } from 'src/utils/constants'
import { PaginationDto, PaginationMetaDto } from 'src/shared/dto/pagination'
import { FindAllBlogsQueryDto } from 'src/blog/dto/find-all-blog.dto'

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createBlogDto: CreateBlogDto): Promise<BlogDto> {
    try {
      const slug = generateSlug(createBlogDto.title)

      const createdBlog = await this.prisma.blog.create({
        data: {
          title: createBlogDto.title,
          slug,
          content: createBlogDto.content,
          featuredImage: createBlogDto.featuredImage,
          author: {
            connect: {
              id: userId,
            },
          },
          categories: {
            connect: createBlogDto.categories.map((categoryId) => ({
              id: categoryId,
            })),
          },
        },
        include: {
          categories: {
            select: {
              id: true,
              title: true,
              slug: true,
              icon: true,
              description: true,
              featuredImage: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          comments: {
            where: {
              isBlocked: false,
            },
          },
          author: {
            select: {
              email: true,
              userProfile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                  occupation: true,
                  city: true,
                  country: true,
                },
              },
            },
          },
        },
      })

      return createdBlog
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          const errorMessage =
            'A blog is already created with this title, you can not create a blog with the same title'

          throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST)
        }
      }
      throw e
    }
  }

  async findAllPublished(
    queries: FindAllBlogsQueryDto
  ): Promise<PaginationDto<Blog>> {
    const { skip, perPage, search, order, orderBy, category } = queries

    const blogs = await this.prisma.blog.findMany({
      take: perPage,
      skip,
      orderBy: {
        [orderBy]: order,
      },
      where: {
        AND: [
          {
            isPublished: true,
          },
          {
            title: {
              search: search && search.trim().length > 0 ? search : undefined,
            },
          },
          {
            categories: {
              some: {
                slug: category ? category : undefined,
              },
            },
          },
        ],
      },
      include: {
        categories: {
          select: {
            id: true,
            title: true,
            slug: true,
            icon: true,
            description: true,
            featuredImage: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        author: {
          select: {
            email: true,
            userProfile: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
                occupation: true,
                city: true,
                country: true,
              },
            },
          },
        },
      },
    })

    const total = await this.prisma.blog.count({
      where: {
        AND: [
          {
            isPublished: true,
          },
          {
            title: {
              search: search && search.trim().length > 0 ? search : undefined,
            },
          },
          {
            categories: {
              some: {
                slug: category ? category : undefined,
              },
            },
          },
        ],
      },
    })

    const paginationMeta = new PaginationMetaDto({
      total,
      paginationOptionsDto: { perPage, skip, order, orderBy },
    })

    const paginatedResponse = new PaginationDto(blogs, paginationMeta)
    return paginatedResponse
  }

  async findAll(
    roleNames: string[],
    queries: FindAllBlogsQueryDto
  ): Promise<PaginationDto<Blog>> {
    const { skip, perPage, search, isPublished, order, orderBy, category } =
      queries

    const hasPermission = roleNames.some((roleName) =>
      ROLES_WITH_SPECIAL_PERMISSIONS.includes(roleName)
    )

    if (!hasPermission) {
      throw new ForbiddenException('Forbidden resource')
    }

    const blogs = await this.prisma.blog.findMany({
      take: perPage,
      skip,
      orderBy: {
        [orderBy]: order,
      },
      where: {
        AND: [
          {
            isPublished:
              typeof isPublished === 'undefined'
                ? undefined
                : Boolean(isPublished),
          },
          {
            title: {
              search: search && search.trim().length > 0 ? search : undefined,
            },
          },
          {
            categories: {
              some: {
                slug: category ? category : undefined,
              },
            },
          },
        ],
      },
      include: {
        categories: {
          select: {
            id: true,
            title: true,
            slug: true,
            icon: true,
            description: true,
            featuredImage: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        author: {
          select: {
            email: true,
            userProfile: true,
          },
        },
      },
    })

    const total = await this.prisma.blog.count({
      where: {
        AND: [
          {
            isPublished:
              typeof isPublished === 'undefined'
                ? undefined
                : Boolean(isPublished),
          },
          {
            title: {
              search: search && search.trim().length > 0 ? search : undefined,
            },
          },
          {
            categories: {
              some: {
                slug: category ? category : undefined,
              },
            },
          },
        ],
      },
    })

    const paginationMeta = new PaginationMetaDto({
      total,
      paginationOptionsDto: { perPage, skip, order, orderBy },
    })

    const paginatedResponse = new PaginationDto(blogs, paginationMeta)
    return paginatedResponse
  }

  async findPublishedBlog(slugOrId: string): Promise<BlogDto> {
    const isId = !isNaN(parseInt(slugOrId))

    const foundBlog = await this.prisma.blog.findFirst({
      where: {
        isPublished: true,
        OR: [
          {
            id: isId ? parseInt(slugOrId) : undefined,
          },
          {
            slug: !isId ? String(slugOrId) : undefined,
          },
        ],
      },
      include: {
        categories: {
          select: {
            id: true,
            title: true,
            slug: true,
            icon: true,
            description: true,
            featuredImage: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        comments: {
          where: {
            isBlocked: false,
          },
          include: {
            author: {
              select: {
                email: true,
                userProfile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    occupation: true,
                    city: true,
                    country: true,
                  },
                },
              },
            },
          },
        },
        author: {
          select: {
            email: true,
            userProfile: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
                occupation: true,
                city: true,
                country: true,
              },
            },
          },
        },
      },
    })
    if (!foundBlog) {
      throw new NotFoundException('Blog not found')
    }

    return foundBlog
  }

  async findAnyBlog(
    userId: number,
    roleNames: string[],
    slugOrId: string
  ): Promise<BlogDto> {
    const isId = !isNaN(parseInt(slugOrId))

    const foundBlog = await this.prisma.blog.findFirst({
      where: {
        OR: [
          {
            id: isId ? parseInt(slugOrId) : undefined,
          },
          {
            slug: !isId ? String(slugOrId) : undefined,
          },
        ],
      },
      include: {
        categories: {
          select: {
            id: true,
            title: true,
            slug: true,
            icon: true,
            description: true,
            featuredImage: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        comments: {
          where: {
            isBlocked: false,
          },
        },
        author: {
          select: {
            email: true,
            userProfile: true,
          },
        },
      },
    })
    if (!foundBlog) {
      throw new NotFoundException('Blog not found')
    }

    const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roleNames)
    const isNotCreatedByThisUser = foundBlog.authorId !== userId

    if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
      throw new ForbiddenException('Forbidden resource')
    }

    return foundBlog
  }

  async update(
    userId: number,
    blogId: number,
    roles: string[],
    updateBlogDto: UpdateBlogDto
  ): Promise<BlogDto> {
    try {
      const foundBlog = await this.prisma.blog.findUnique({
        where: {
          id: blogId,
        },
        include: {
          categories: true,
        },
      })

      if (!foundBlog) {
        throw new NotFoundException('Blog not found')
      }

      const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roles)
      const isNotCreatedByThisUser = foundBlog.authorId !== userId

      if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
        throw new ForbiddenException('Forbidden resource')
      }

      let slug: string = null

      if (updateBlogDto.title) {
        slug = generateSlug(updateBlogDto.title)
      }
      const connectIds = updateBlogDto.categories.map((categoryId) => ({
        id: categoryId,
      }))
      const disconnect = foundBlog.categories.filter(
        (category) => !updateBlogDto.categories.includes(category.id)
      )
      const disconnectIds = disconnect.map((category) => ({
        id: category.id,
      }))

      const updatedBlog = await this.prisma.blog.update({
        where: {
          id: blogId,
        },
        data: {
          title: updateBlogDto.title || foundBlog.title,
          slug,
          content: updateBlogDto.content || foundBlog.content,
          featuredImage: updateBlogDto.featuredImage || foundBlog.featuredImage,
          categories: {
            connect: connectIds,
            disconnect: disconnectIds,
          },
        },
        include: {
          categories: {
            select: {
              id: true,
              title: true,
              slug: true,
              icon: true,
              description: true,
              featuredImage: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          author: {
            select: {
              email: true,
              userProfile: true,
            },
          },
        },
      })
      return updatedBlog
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code === 'P2002') {
          const errorMessage =
            'A blog is already created with this title, you can not create a blog with the same title'

          throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST)
        }
      }
      throw error
    }
  }

  async deleteById(
    userId: number,
    roles: string[],
    blogId: number
  ): Promise<void> {
    try {
      const foundBlog = await this.prisma.blog.findUnique({
        where: {
          id: blogId,
        },
      })

      if (!foundBlog) {
        throw new NotFoundException('Blog not found')
      }

      const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roles)
      const isNotCreatedByThisUser = foundBlog.authorId !== userId

      if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
        throw new ForbiddenException('Forbidden resource')
      }

      await this.prisma.blog.delete({
        where: {
          id: blogId,
        },
      })
    } catch (error) {
      // console.error(error)
      throw error
    }
  }

  //Only admin, moderator, and developer can publish or unpublish a blog
  async publishBlog(roleNames: string[], blogId: number): Promise<BlogDto> {
    const foundBlog = await this.prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    })

    if (!foundBlog) {
      throw new NotFoundException('Blog not found')
    }

    const hasPermission = roleNames.some((roleName) =>
      ROLES_WITH_SPECIAL_PERMISSIONS.includes(roleName)
    )

    if (!hasPermission) {
      throw new ForbiddenException('Forbidden resource')
    }

    const publishedBlog = await this.prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
      include: {
        categories: true,
        author: {
          select: {
            email: true,
            userProfile: true,
          },
        },
      },
    })
    return publishedBlog
  }

  async unPublishBlog(roleNames: string[], blogId: number): Promise<BlogDto> {
    const foundBlog = await this.prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    })

    if (!foundBlog) {
      throw new NotFoundException('Blog not found')
    }

    const hasPermission = roleNames.some((roleName) =>
      ROLES_WITH_SPECIAL_PERMISSIONS.includes(roleName)
    )

    if (!hasPermission) {
      throw new ForbiddenException('Forbidden resource')
    }

    const unPublishedBlog = await this.prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        isPublished: false,
        publishedAt: null,
      },
      include: {
        categories: true,
        author: {
          select: {
            email: true,
            userProfile: true,
          },
        },
      },
    })
    return unPublishedBlog
  }
}
