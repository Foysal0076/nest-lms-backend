import { ApiProperty } from '@nestjs/swagger'
import { PaginationParametersDto } from './pagination-meta-parameters.dto'

export class PaginationMetaDto {
  @ApiProperty()
  readonly currentPage: number

  @ApiProperty()
  readonly perPage: number

  @ApiProperty()
  readonly totalItems: number

  @ApiProperty()
  readonly totalPage: number

  @ApiProperty()
  readonly hasPreviousPage: boolean

  @ApiProperty()
  readonly hasNextPage: boolean

  constructor({ paginationOptionsDto, total }: PaginationParametersDto) {
    this.perPage = paginationOptionsDto.perPage
    this.currentPage = paginationOptionsDto.currentPage
    this.totalItems = total
    this.totalPage = Math.ceil(this.totalItems / this.perPage)
    this.hasPreviousPage = this.currentPage > 1
    this.hasNextPage = this.currentPage < this.totalPage
  }
}
