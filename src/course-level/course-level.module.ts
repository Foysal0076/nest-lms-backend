import { Module } from '@nestjs/common'
import { CourseLevelService } from './course-level.service'
import { CourseLevelController } from './course-level.controller'

@Module({
  controllers: [CourseLevelController],
  providers: [CourseLevelService],
})
export class CourseLevelModule {}
