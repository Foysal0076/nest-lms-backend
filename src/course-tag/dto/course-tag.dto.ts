import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CourseTagDto {
  @ApiProperty({ type: Number })
  id: number

  @ApiProperty({ type: String })
  title: string

  @ApiPropertyOptional({ type: String })
  description?: string

  @ApiProperty({ type: Number })
  createdById: number

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
