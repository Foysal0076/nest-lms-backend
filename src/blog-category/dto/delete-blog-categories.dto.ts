import { IsArray } from 'class-validator'

export class DeleteBlogCategoriesDto {
  @IsArray()
  ids: number[]
}
