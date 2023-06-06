import { IsArray } from 'class-validator'

export class DeleteCategoriesDto {
  @IsArray()
  ids: number[]
}
