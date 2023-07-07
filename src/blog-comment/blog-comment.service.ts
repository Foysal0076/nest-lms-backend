import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  BlogCommentDto,
  CreateBlogCommentDto,
  UpdateBlogCommentDto,
} from 'src/blog-comment/dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { checkPermissionOnOthersData } from 'src/utils/helpers'

@Injectable()
export class BlogCommentService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createBlogCommentDto: CreateBlogCommentDto
  ): Promise<BlogCommentDto> {
    const createdBlogComment = await this.prisma.blogComment.create({
      data: {
        content: createBlogCommentDto.content,
        blog: {
          connect: {
            id: createBlogCommentDto.blogId,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        author: true,
      },
    })
    return createdBlogComment
  }

  async update(
    userId: number,
    roleNames: string[],
    commentId: number,
    updateBlogCommentDto: UpdateBlogCommentDto
  ): Promise<BlogCommentDto> {
    const foundBlogComment = await this.prisma.blogComment.findUnique({
      where: {
        id: commentId,
      },
    })

    if (!foundBlogComment) {
      throw new NotFoundException('Blog Comment not found')
    }

    const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roleNames)
    const isNotCreatedByThisUser = foundBlogComment.authorId !== userId

    if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
      throw new ForbiddenException('Forbidden resource')
    }

    const updatedBlogComment = await this.prisma.blogComment.update({
      where: {
        id: commentId,
      },
      data: {
        content: updateBlogCommentDto.content,
      },
      include: {
        author: true,
      },
    })

    return updatedBlogComment
  }

  async remove(
    userId: number,
    roleNames: string[],
    commentId: number
  ): Promise<void> {
    const foundBlogComment = await this.prisma.blogComment.findUnique({
      where: {
        id: commentId,
      },
    })

    if (!foundBlogComment) {
      throw new NotFoundException('Blog Comment not found')
    }
    const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roleNames)
    const isNotCreatedByThisUser = foundBlogComment.authorId !== userId

    if (hasNotPermissionOnOthersData && isNotCreatedByThisUser) {
      throw new ForbiddenException('Forbidden resource')
    }

    await this.prisma.blogComment.delete({
      where: {
        id: commentId,
      },
    })
  }

  //Only admin/moderator/developer can block blogComment
  async blockOrUnblockComment(
    commentId: number,
    roleNames: string[],
    isBlocked: boolean
  ): Promise<BlogCommentDto> {
    const blogComment = await this.prisma.blogComment.findUnique({
      where: {
        id: commentId,
      },
    })

    if (!blogComment) {
      throw new NotFoundException('Blog Comment not found')
    }

    const hasNotPermissionOnOthersData = !checkPermissionOnOthersData(roleNames)

    if (hasNotPermissionOnOthersData) {
      throw new ForbiddenException('Forbidden resource')
    }

    const blockedBlogComment = await this.prisma.blogComment.update({
      where: {
        id: commentId,
      },
      data: {
        isBlocked,
      },
      include: {
        author: true,
      },
    })
    return blockedBlogComment
  }
}
