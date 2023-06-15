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
import { CourseTagService } from './course-tag.service'
import {
  CourseTagDto,
  CreateCourseTagDto,
  DeleteCourseTagsDto,
  UpdateCourseTagDto,
} from 'src/course-tag/dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { GetUser } from 'src/auth/decorator'
import { JWTAuthGuard } from 'src/auth/guard'
import { AuthUser } from 'src/utils/types'
import { RolesGuard } from 'src/role/guard'
import { Roles } from 'src/role/decorator'
import { PaginationOptionsDto } from 'src/shared/dto/pagination'
import { ApiPaginatedResponse } from 'src/shared/decorator'

@ApiTags('Course Tags')
@Controller('course-tags')
@Roles('CourseTag')
export class CourseTagController {
  constructor(private readonly courseTagService: CourseTagService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create Course Tag' })
  @ApiCreatedResponse({
    description: 'Successfully created course tag',
    type: CourseTagDto,
  })
  create(
    @GetUser('id') userId: number,
    @Body() createCourseTagDto: CreateCourseTagDto
  ) {
    return this.courseTagService.create(userId, createCourseTagDto)
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Course Tags' })
  @ApiPaginatedResponse(CourseTagDto)
  findAll(@Query() queryParams: PaginationOptionsDto) {
    return this.courseTagService.findAll(queryParams)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Course Tag by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseTagService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course tag by id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  update(
    @GetUser() user: AuthUser,
    @Param('id', ParseIntPipe) tagId: number,
    @Body() updateCourseTagDto: UpdateCourseTagDto
  ) {
    const roleNames = user.roles.map((role) => role.title)
    return this.courseTagService.update(
      user.id,
      roleNames,
      tagId,
      updateCourseTagDto
    )
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Course Tag by id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  remove(@GetUser() user: AuthUser, @Param('id', ParseIntPipe) tagId: number) {
    const roleNames = user.roles.map((role) => role.title)
    return this.courseTagService.remove(user.id, roleNames, tagId)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @ApiOperation({ summary: 'Delete Many Course Tags by ids' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  removeMany(@GetUser() user: AuthUser, @Body() tags: DeleteCourseTagsDto) {
    const roleNames = user.roles.map((role) => role.title)
    return this.courseTagService.removeMany(user.id, roleNames, tags.ids)
  }
}
