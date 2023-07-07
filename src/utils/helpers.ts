import { TableAccess } from '@prisma/client'
import { ROLES_WITH_SPECIAL_PERMISSIONS } from 'src/utils/constants'

export const generateSlug = (
  title: string,
  delimiter = '-',
  max_length = null
) => {
  // Convert to lowercase and remove leading/trailing spaces
  let slug = title.toLowerCase().trim()

  // Replace spaces with delimiter
  slug = slug.replace(/\s+/g, delimiter)

  // Remove special characters except delimiter and numbers
  slug = slug.replace(/[^a-z0-9\-]/g, '')

  // Collapse multiple consecutive delimiters
  slug = slug.replace(/-{2,}/g, delimiter)

  // Remove remaining special characters at the beginning/end
  slug = slug.replace(/^-+|-+$/g, '')

  // Trim to max_length, if specified
  if (max_length !== null && slug.length > max_length) {
    slug = slug.slice(0, max_length).replace(/-$/, '')
  }

  return slug
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
