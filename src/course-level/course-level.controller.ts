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
import { CourseLevelService } from './course-level.service'
import {
  CourseLevelDto,
  CreateCourseLevelDto,
  DeleteCourseLevelsDto,
  UpdateCourseLevelDto,
} from 'src/course-level/dto'
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

@ApiTags('Course Levels')
@Controller('course-levels')
@Roles('CourseLevel')
export class CourseLevelController {
  constructor(private readonly courseLevelService: CourseLevelService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create Course Level' })
  @ApiCreatedResponse({
    description: 'Successfully created course level',
    type: CourseLevelDto,
  })
  create(
    @GetUser('id') userId: number,
    @Body() createCourseLevelDto: CreateCourseLevelDto
  ) {
    return this.courseLevelService.create(userId, createCourseLevelDto)
  }

  @Get()
  @ApiOperation({ summary: 'Fetch All Course Levels' })
  @ApiPaginatedResponse(CourseLevelDto)
  findAll(@Query() queryParams: PaginationOptionsDto) {
    return this.courseLevelService.findAll(queryParams)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch Course Level by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.courseLevelService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course level by id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  update(
    @GetUser() user: AuthUser,
    @Param('id', ParseIntPipe) levelId: number,
    @Body() updateCourseLevelDto: UpdateCourseLevelDto
  ) {
    const roleNames = user.roles.map((role) => role.title)
    return this.courseLevelService.update(
      user.id,
      roleNames,
      levelId,
      updateCourseLevelDto
    )
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Course Level by id' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  remove(
    @GetUser() user: AuthUser,
    @Param('id', ParseIntPipe) levelId: number
  ) {
    const roleNames = user.roles.map((role) => role.title)
    return this.courseLevelService.remove(user.id, roleNames, levelId)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @ApiOperation({ summary: 'Delete Many Course Levels by ids' })
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  removeMany(@GetUser() user: AuthUser, @Body() levels: DeleteCourseLevelsDto) {
    const roleNames = user.roles.map((role) => role.title)
    return this.courseLevelService.removeMany(user.id, roleNames, levels.ids)
  }
}
