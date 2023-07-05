import { Injectable } from '@nestjs/common'
import {
  BlogCommentDto,
  CreateBlogCommentDto,
  UpdateBlogCommentDto,
} from 'src/blog-comment/dto'
import { PrismaService } from 'src/prisma/prisma.service'

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
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
    return createdBlogComment
  }

  async findAll() {
    return `This action returns all blogComment`
  }

  async findOne(id: number) {
    return `This action returns a #${id} blogComment`
  }

  async update(id: number, updateBlogCommentDto: UpdateBlogCommentDto) {
    return `This action updates a #${id} blogComment`
  }

  async remove(id: number) {
    return `This action removes a #${id} blogComment`
  }

  //Only admin/moderator/developer can block blogComment
  async blockComment(id: number) {
    return `This action blocks a #${id} blogComment`
  }
}
