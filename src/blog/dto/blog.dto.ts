import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
} from '@nestjs/swagger'
import { BlogCategoryDto } from 'src/blog-category/dto'

export class BlogDto {
  @ApiProperty({ type: Number })
  id: number

  @ApiProperty({ type: String })
  title: string

  @ApiProperty({ type: String })
  slug: string

  @ApiPropertyOptional({ type: String })
  featuredImage?: string

  @ApiPropertyOptional({ type: String })
  content?: string

  @ApiProperty({ type: Boolean })
  isPublished: boolean

  @ApiPropertyOptional({ type: Date })
  publishedAt?: Date

  @ApiProperty({ isArray: true, type: () => BlogCategory })
  categories: BlogCategory[]

  // @ApiProperty({ isArray: true, type: () => BlogComment })
  // comments: BlogComment[]

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}

@ApiExtraModels()
class BlogCategory extends OmitType(BlogCategoryDto, [
  'createdById',
] as const) {}
