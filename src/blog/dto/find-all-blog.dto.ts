import { ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { ArrayNotEmpty, IsBoolean, IsNumber, IsOptional } from 'class-validator'
import { PaginationOptionsDto } from 'src/shared/dto/pagination'

export class FindAllBlogsQueryDto extends PaginationOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (isNaN(parseInt(value))) return false
      return [parseInt(value)]
    }
    return value.map((v: string) => parseInt(v))
  })
  category?: number[]

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
