import { Expose } from 'class-transformer'

export class UserProfileDto {
  id: number
  firstName: string
  lastName: string
  avatar: string
  state: string
  city: string
  country: string
  zip: string
  phone: string
  addressLine: string
  addressLine2: string
  occupation: string
  dateOfBirth: Date
  gender: string
  createdAt: Date
  updatedAt: Date

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  @Expose()
  get age(): number {
    if (!this.dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(this.dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
    return age
  }

  constructor(partial: Partial<UserProfileDto>) {
    Object.assign(this, partial)
  }
}
