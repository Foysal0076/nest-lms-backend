import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import { CourseCategoryService } from './course-category.service'
import {
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
} from 'src/course-category/dto'

@Controller('course-categories')
export class CourseCategoryController {
  constructor(private readonly courseCategoryService: CourseCategoryService) {}

  @Post()
  create(@Body() createCourseCategoryDto: CreateCourseCategoryDto) {
    return this.courseCategoryService.create(createCourseCategoryDto)
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseCategoryDto: UpdateCourseCategoryDto
  ) {
    return this.courseCategoryService.update(id, updateCourseCategoryDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.courseCategoryService.remove(id)
  }
}
