import { IsInt, IsString } from 'class-validator'

export class CreateBlogCommentDto {
  @IsString()
  content: string

  @IsInt()
  blogId: number
}
