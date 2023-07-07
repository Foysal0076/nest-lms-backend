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
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common'
import { BlogCategoryService } from './blog-category.service'
import {
  BlogCategoryDto,
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
} from 'src/blog-category/dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { GetUser } from 'src/auth/decorator'
import { JWTAuthGuard } from 'src/auth/guard'
import { AuthUser } from 'src/utils/types'
import { DeleteBlogCategoriesDto } from 'src/blog-category/dto/delete-blog-categories.dto'
import { UserRole } from 'src/utils/types/auth'
import { RolesGuard } from 'src/role/guard'
import { Roles } from 'src/role/decorator'
import { PaginationOptionsDto } from 'src/shared/dto/pagination'
import { ApiPaginatedResponse } from 'src/shared/decorator'

@ApiTags('Blog Categories')
@Controller('blog-categories')
@Roles('BlogCategory')
export class BlogCategoryController {
  constructor(private readonly courseCategoryService: BlogCategoryService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create Blog Category' })
  @ApiCreatedResponse({
    description: 'Successfully created blog category',
    type: BlogCategoryDto,
  })
  create(
    @GetUser('id') userId: number,
    @GetUser('roles') roles: UserRole[],
    @Body() createBlogCategoryDto: CreateBlogCategoryDto
  ) {
    return this.courseCategoryService.create(
      userId,
      roles,
      createBlogCategoryDto
    )
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Blog Categories' })
  @ApiPaginatedResponse(BlogCategoryDto)
  findAll(@Query() queryParams: PaginationOptionsDto) {
    return this.courseCategoryService.findAll(queryParams)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Blog Category by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseCategoryService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update blog category by id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  update(
    @GetUser() user: AuthUser,
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() updateBlogCategoryDto: UpdateBlogCategoryDto
  ) {
    const roleNames = user.roles.map((role) => role.title)
    return this.courseCategoryService.update(
      user.id,
      roleNames,
      categoryId,
      updateBlogCategoryDto
    )
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Blog Category by id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  remove(
    @GetUser() user: AuthUser,
    @Param('id', ParseIntPipe) categoryId: number
  ) {
    return this.courseCategoryService.remove(user.id, categoryId)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @ApiOperation({ summary: 'Delete Many Blog Categories by ids' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  removeMany(
    @GetUser() user: AuthUser,
    @Body() categories: DeleteBlogCategoriesDto
  ) {
    return this.courseCategoryService.removeMany(user.id, categories.ids)
  }
}
