import { PaginationOptionsDto } from './pagination-options.dto'

export interface PaginationParametersDto {
  paginationOptionsDto: PaginationOptionsDto
  total: number
}
