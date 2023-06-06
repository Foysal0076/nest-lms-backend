import { TableAccess } from '@prisma/client'

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
