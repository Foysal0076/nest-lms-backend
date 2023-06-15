import { PartialType, PickType } from '@nestjs/swagger'
import { SignupDto } from 'src/auth/dto'

class UpdateDto extends PickType(SignupDto, ['email', 'password'] as const) {}

export class UpdateUserDto extends PartialType(UpdateDto) {
  // PartialType creates a class with all the properties of the original class set to optional.
  // This means that we can use the same DTO for both creating and updating a user.
}
