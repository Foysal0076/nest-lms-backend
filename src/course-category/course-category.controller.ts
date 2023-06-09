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
import { CourseCategoryService } from './course-category.service'
import {
  CourseCategoryDto,
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
} from 'src/course-category/dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { GetUser } from 'src/auth/decorator'
import { JWTAuthGuard } from 'src/auth/guard'
import { AuthUser } from 'src/utils/types'
import { DeleteCategoriesDto } from 'src/course-category/dto/delete-categories.dto'
import { UserRole } from 'src/utils/types/auth'
import { RolesGuard } from 'src/role/guard'
import { Roles } from 'src/role/decorator'
import { PaginationOptionsDto } from 'src/shared/dto/pagination'
import { ApiPaginatedResponse } from 'src/shared/decorator'

@ApiTags('Course Categories')
@Controller('course-categories')
@Roles('CourseCategory')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create Course Category' })
  @ApiCreatedResponse({
    description: 'Successfully created course category',
    type: CourseCategoryDto,
  })
  create(
    @GetUser('id') userId: number,
    @GetUser('roles') roles: UserRole[],
    @Body() createCourseCategoryDto: CreateCourseCategoryDto
  ) {
    return this.courseCategoryService.create(
      userId,
      roles,
      createCourseCategoryDto
    )
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Course Categories' })
  @ApiPaginatedResponse(CourseCategoryDto)
  findAll(@Query() queryParams: PaginationOptionsDto) {
    return this.courseCategoryService.findAll(queryParams)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Course Category by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseCategoryService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course category by id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  update(
    @GetUser() user: AuthUser,
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() updateCourseCategoryDto: UpdateCourseCategoryDto
  ) {
    const roleNames = user.roles.map((role) => role.title)
    return this.courseCategoryService.update(
      user.id,
      roleNames,
      categoryId,
      updateCourseCategoryDto
    )
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Course Category by id' })
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
  @ApiOperation({ summary: 'Delete Many Course Categories by ids' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  removeMany(
    @GetUser() user: AuthUser,
    @Body() categories: DeleteCategoriesDto
  ) {
    return this.courseCategoryService.removeMany(user.id, categories.ids)
  }
}
