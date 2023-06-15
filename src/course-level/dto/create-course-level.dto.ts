import { IsOptional, IsString } from 'class-validator'

export class CreateCourseLevelDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  courseIds?: number[]
}
