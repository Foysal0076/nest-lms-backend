import { ApiProperty } from '@nestjs/swagger'

export class BlogCommentDto {
  @ApiProperty({ type: Number })
  id: number

  @ApiProperty({ type: String })
  content: string

  @ApiProperty({ type: Boolean, default: false })
  isBlocked: boolean

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
