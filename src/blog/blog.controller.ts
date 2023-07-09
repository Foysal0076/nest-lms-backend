import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common'
import { BlogService } from './blog.service'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { Roles } from 'src/role/decorator'
import { JWTAuthGuard } from 'src/auth/guard'
import { RolesGuard } from 'src/role/guard'
import { BlogDto } from 'src/blog/dto'
import { GetUser } from 'src/auth/decorator'
import { UserRole } from 'src/utils/types/auth'
import { ApiPaginatedResponse } from 'src/shared/decorator'
import {
  FindAllBlogsQueryDto,
  FindAllBlogsQueryPublicDto,
} from 'src/blog/dto/find-all-blog.dto'

@ApiTags('Blog ')
@Controller('blogs')
@Roles('Blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create Blog' })
  @ApiCreatedResponse({
    description: 'Successfully created blog',
    type: BlogDto,
  })
  create(
    @GetUser('id', ParseIntPipe) userId: number,
    @Body() createBlogDto: CreateBlogDto
  ) {
    return this.blogService.create(userId, createBlogDto)
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Blogs' })
  @ApiPaginatedResponse(BlogDto)
  findAllPublished(@Query() queries: FindAllBlogsQueryPublicDto) {
    return this.blogService.findAllPublished(queries)
  }

  @Get('all')
  @ApiOperation({ summary: 'Fetch All Blogs including unpublished' })
  @ApiBearerAuth()
  @ApiPaginatedResponse(BlogDto)
  @UseGuards(JWTAuthGuard, RolesGuard)
  findAll(
    @Query() queries: FindAllBlogsQueryDto,
    @GetUser('roles') roles: UserRole[]
  ) {
    const roleNames = roles.map((role) => role.title)
    return this.blogService.findAll(roleNames, queries)
  }

  @Get(':slugOrId')
  @ApiOperation({ summary: 'Fetch blog by slug or id, only publised' })
  findOne(@Param('slugOrId') slugOrId: string) {
    const _slugOrId = slugOrId.trim()
    return this.blogService.findPublishedBlog(_slugOrId)
  }

  @Get('all/:slugOrId')
  @ApiOperation({ summary: 'Fetch any blog by slug or id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  findAnyBlog(
    @Param('slugOrId') slugOrId: string,
    @GetUser('id') userId: number,
    @GetUser('roles') roles: UserRole[]
  ) {
    const _slugOrId = slugOrId.trim()
    const roleNames = roles.map((role) => role.title)
    return this.blogService.findAnyBlog(userId, roleNames, _slugOrId)
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiOperation({ summary: 'Update blog by id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  update(
    @Param('id', ParseIntPipe) blogId: number,
    @GetUser('roles') roles: UserRole[],
    @GetUser('id', ParseIntPipe) userId: number,
    @Body() updateBlogDto: UpdateBlogDto
  ) {
    const roleNames = roles.map((role) => role.title)
    return this.blogService.update(userId, blogId, roleNames, updateBlogDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete blog by id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) blogId: number,
    @GetUser('roles') roles: UserRole[],
    @GetUser('id', ParseIntPipe) userId: number
  ) {
    const roleNames = roles.map((role) => role.title)
    return this.blogService.deleteById(userId, roleNames, blogId)
  }

  @Patch('publish/:id')
  @ApiOperation({ summary: 'Publish blog by id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiOkResponse({
    description: 'Successfully publish the blog',
    type: BlogDto,
  })
  publishBlog(
    @Param('id', ParseIntPipe) blogId: number,
    @GetUser('roles') roles: UserRole[]
  ) {
    const roleNames = roles.map((role) => role.title)
    return this.blogService.publishBlog(roleNames, blogId)
  }

  @Patch('unpublish/:id')
  @ApiOperation({ summary: 'Un-Publish blog by id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard)
  @ApiOkResponse({
    description: 'Successfully un-publish the blog',
    type: BlogDto,
  })
  unPublishBlog(
    @Param('id', ParseIntPipe) blogId: number,
    @GetUser('roles') roles: UserRole[]
  ) {
    const roleNames = roles.map((role) => role.title)
    return this.blogService.unPublishBlog(roleNames, blogId)
  }
}
