import { ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { PaginationOptionsDto } from 'src/shared/dto/pagination'

export class FindAllBlogsQueryDto extends PaginationOptionsDto {
  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    !value || value == 'true' || value == '1' ? true : false
  )
  isPublished?: boolean
}

export class FindAllBlogsQueryPublicDto extends OmitType(FindAllBlogsQueryDto, [
  'isPublished',
]) {}
