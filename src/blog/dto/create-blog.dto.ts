import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  featuredImage?: string

  @IsString()
  @IsNotEmpty()
  content: string

  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  categories: number[]
}
