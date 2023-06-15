import { PartialType } from '@nestjs/swagger'
import { CreateCourseTagDto } from './create-course-tag.dto'

export class UpdateCourseTagDto extends PartialType(CreateCourseTagDto) {}
