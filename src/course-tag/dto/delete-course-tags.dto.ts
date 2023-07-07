import { IsArray } from 'class-validator'

export class DeleteCourseTagsDto {
  @IsArray()
  ids: number[]
}
