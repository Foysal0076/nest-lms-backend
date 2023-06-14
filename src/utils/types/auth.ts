import { User } from '@prisma/client'

export type UserRole = {
  id: number
  title: string
}

export interface AuthUser extends User {
  roles: UserRole[]
}
