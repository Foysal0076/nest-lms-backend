import { IsArray } from 'class-validator'

export class DeleteCourseLevelsDto {
  @IsArray()
  ids: number[]
}
