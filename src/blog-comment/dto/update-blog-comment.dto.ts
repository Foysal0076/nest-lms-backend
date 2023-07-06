import { PickType } from '@nestjs/swagger'
import { CreateBlogCommentDto } from './create-blog-comment.dto'

export class UpdateBlogCommentDto extends PickType(CreateBlogCommentDto, [
  'content',
] as const) {}
