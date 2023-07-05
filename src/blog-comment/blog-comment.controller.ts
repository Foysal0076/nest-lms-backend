import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { BlogCommentService } from './blog-comment.service'
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto'
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/role/decorator'
import { GetUser } from 'src/auth/decorator'
import { JWTAuthGuard } from 'src/auth/guard'
import { RolesGuard } from 'src/role/guard'

@Controller('blog-comments')
@ApiTags('Blog Comments')
@Roles('BlogComment')
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create Blog Comment' })
  create(
    @GetUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) blogId: number,
    @Body() createBlogCommentDto: CreateBlogCommentDto
  ) {
    return this.blogCommentService.create(userId, createBlogCommentDto)
  }

  @Get()
  findAll() {
    return this.blogCommentService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogCommentService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogCommentDto: UpdateBlogCommentDto
  ) {
    return this.blogCommentService.update(+id, updateBlogCommentDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogCommentService.remove(+id)
  }
}
