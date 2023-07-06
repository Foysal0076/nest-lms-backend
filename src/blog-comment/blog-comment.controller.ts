import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { BlogCommentService } from './blog-comment.service'
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto'
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Roles } from 'src/role/decorator'
import { GetUser } from 'src/auth/decorator'
import { JWTAuthGuard } from 'src/auth/guard'
import { RolesGuard } from 'src/role/guard'
import { UserRole } from 'src/utils/types/auth'

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
    @Body() createBlogCommentDto: CreateBlogCommentDto
  ) {
    return this.blogCommentService.create(userId, createBlogCommentDto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Blog Comment' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  update(
    @Param('id', ParseIntPipe) commentId: number,
    @Body() updateBlogCommentDto: UpdateBlogCommentDto,
    @GetUser('roles') roles: UserRole[],
    @GetUser('id', ParseIntPipe) userId: number
  ) {
    const roleNames = roles.map((role) => role.title)
    return this.blogCommentService.update(
      userId,
      roleNames,
      commentId,
      updateBlogCommentDto
    )
  }

  @Patch('block/:id')
  @ApiOperation({ summary: 'Block Blog Comment' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  blockComment(
    @Param('id', ParseIntPipe) commentId: number,
    @GetUser('roles') roles: UserRole[]
  ) {
    const roleNames = roles.map((role) => role.title)
    return this.blogCommentService.blockOrUnblockComment(
      commentId,
      roleNames,
      true
    )
  }

  @Patch('unblock/:id')
  @ApiOperation({ summary: 'Unblock Blog Comment' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  unblockComment(
    @Param('id', ParseIntPipe) commentId: number,
    @GetUser('roles') roles: UserRole[]
  ) {
    const roleNames = roles.map((role) => role.title)
    return this.blogCommentService.blockOrUnblockComment(
      commentId,
      roleNames,
      false
    )
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog comment' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  remove(
    @Param('id', ParseIntPipe) commentId: number,
    @GetUser('roles') roles: UserRole[],
    @GetUser('id') userId: number
  ) {
    const roleNames = roles.map((role) => role.title)
    return this.blogCommentService.remove(userId, roleNames, commentId)
  }
}
