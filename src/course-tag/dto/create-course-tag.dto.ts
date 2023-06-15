import { IsOptional, IsString } from 'class-validator'

export class CreateCourseTagDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  courseIds?: number[]
}
