import { IsOptional, IsString } from 'class-validator'

export class CreateBlogCategoryDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  icon?: string

  @IsOptional()
  @IsString()
  featuredImage?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  blogIds?: number[]
}
