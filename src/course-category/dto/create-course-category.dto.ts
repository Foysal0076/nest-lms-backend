import { IsOptional, IsString } from 'class-validator'

export class CreateCourseCategoryDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  icon?: string

  @IsOptional()
  @IsString()
  featuredImage?: number

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  courseIds?: number[]
}
