import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { Prisma } from '@prisma/client'
import { Order } from 'src/utils/constants'

export class PaginationOptionsDto {
  @ApiPropertyOptional({ enum: Prisma.SortOrder, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  order?: Prisma.SortOrder = Order.ASC

  @ApiPropertyOptional({ default: 'createdAt' })
  @IsString()
  @IsOptional()
  orderBy?: string = 'createdAt'

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1

  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  take?: number = 1

  get skip(): number {
    return (this.page - 1) * this.take
  }
}
