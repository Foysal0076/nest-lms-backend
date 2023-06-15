import { TableAccess } from '@prisma/client'
import { ROLES_WITH_SPECIAL_PERMISSIONS } from 'src/utils/constants'

export const generateSlug = (title: string) => {
  return title.toLowerCase().replace(' ', '-')
}

export const mapRequestMethodToTableAccess = (method: string) => {
  switch (method) {
    case 'get':
      return TableAccess.READ
    case 'post':
    case 'put':
    case 'patch':
      return TableAccess.WRITE
    case 'delete':
      return TableAccess.DELETE
    default:
      return TableAccess.READ
  }
}

export const checkPermissionOnOthersData = (userRoles: string[]) => {
  const specialPermissions = ROLES_WITH_SPECIAL_PERMISSIONS.map((permission) =>
    permission.toLowerCase()
  )
  return userRoles.some((role) =>
    specialPermissions.includes(role.toLowerCase())
  )
}
