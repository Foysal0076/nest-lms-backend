import { ApiProperty } from '@nestjs/swagger'
import { PaginationParametersDto } from './pagination-meta-parameters.dto'

export class PaginationMetaDto {
  @ApiProperty()
  readonly page: number

  @ApiProperty()
  readonly take: number

  @ApiProperty()
  readonly itemCount: number

  @ApiProperty()
  readonly pageCount: number

  @ApiProperty()
  readonly hasPreviousPage: boolean

  @ApiProperty()
  readonly hasNextPage: boolean

  constructor({ paginationOptionsDto, itemCount }: PaginationParametersDto) {
    this.take = paginationOptionsDto.take
    this.page = paginationOptionsDto.page
    this.itemCount = itemCount
    this.pageCount = Math.ceil(this.itemCount / this.take)
    this.hasPreviousPage = this.page > 1
    this.hasNextPage = this.page < this.pageCount
  }
}
