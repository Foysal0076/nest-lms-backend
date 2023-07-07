import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateBlogDto {
  @IsOptional()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  featuredImage?: string

  @IsString()
  content: string

  @IsNumber({}, { each: true })
  categories: number[]
}
