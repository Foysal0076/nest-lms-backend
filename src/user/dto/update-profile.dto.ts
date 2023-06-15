import { IsOptional } from 'class-validator'

// export class UpdateProfileDto extends PartialType(UserProfileDto) {} //For the time being this is not working

export class UpdateProfileDto {
  @IsOptional()
  firstName?: string

  @IsOptional()
  lastName?: string

  @IsOptional()
  avatar?: string

  @IsOptional()
  state?: string

  @IsOptional()
  city?: string

  @IsOptional()
  country?: string

  @IsOptional()
  zipCode?: string

  @IsOptional()
  phone?: string

  @IsOptional()
  addressLine1?: string

  @IsOptional()
  addressLine2?: string

  @IsOptional()
  occupation?: string

  @IsOptional()
  dateOfBirth?: Date

  @IsOptional()
  gender?: string
}
