import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class BlogCategoryDto {
  @ApiProperty({ type: Number })
  id: number

  @ApiProperty({ type: String })
  title: string

  @ApiProperty({ type: String })
  slug: string

  @ApiPropertyOptional({ type: String })
  icon?: string

  @ApiPropertyOptional({ type: String })
  featuredImage?: string

  @ApiPropertyOptional({ type: String })
  description?: string

  @ApiProperty({ type: Number })
  createdById?: number

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
