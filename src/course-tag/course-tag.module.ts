import { Module } from '@nestjs/common'
import { CourseTagService } from './course-tag.service'
import { CourseTagController } from './course-tag.controller'

@Module({
  controllers: [CourseTagController],
  providers: [CourseTagService],
})
export class CourseTagModule {}
