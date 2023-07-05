import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { PaginationOptionsDto } from 'src/shared/dto/pagination'

export class FindAllBlogsQueryDto extends PaginationOptionsDto {
  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  category?: string

  @ApiPropertyOptional({ default: true })
  isPublished?: boolean
}
