export class CreateCourseCategoryDto {
  title: string
  icon?: string
  featuredImage?: number
  description?: string
  createdBy: number
  courseIds?: number[]
}
