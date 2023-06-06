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
} from '@nestjs/common'
import { CourseCategoryService } from './course-category.service'
import {
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
} from 'src/course-category/dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { GetUser } from 'src/auth/decorator'
import { JWTAuthGuard } from 'src/auth/guard'
import { AuthUser } from 'src/utils/types'
import { DeleteCategoriesDto } from 'src/course-category/dto/delete-categories.dto'
import { UserRole } from 'src/utils/types/auth'
import { RolesGuard } from 'src/role/guard'
import { Roles } from 'src/role/decorator'

@ApiTags('Course Categories')
@Controller('course-categories')
@Roles('CourseCategory')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create Course Category' })
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
  findAll() {
    return this.courseCategoryService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseCategoryService.findOne(+id)
  }

  @Patch(':id')
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
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  removeMany(
    @GetUser() user: AuthUser,
    @Body() categoryIds: DeleteCategoriesDto
  ) {
    return this.courseCategoryService.removeMany(user.id, categoryIds.ids)
  }
}
