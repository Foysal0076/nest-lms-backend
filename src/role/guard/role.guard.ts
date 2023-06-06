import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaService } from 'src/prisma/prisma.service'
import { mapRequestMethodToTableAccess } from 'src/utils/helpers'
import { UserRole } from 'src/utils/types/auth'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const table = this.reflector.getAllAndOverride('table', [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest()
    const userRoles = request?.user?.roles as UserRole[]

    //if unauthenticated, allow access to public operations
    if (!request?.user) {
      return true
    }

    // if user has no roles, deny access
    if (userRoles?.length === 0) {
      return false
    }

    // if user is admin, allow access to all operations
    const roleNames = userRoles.map((role) => role.title)
    if (roleNames.includes('Admin')) return true

    const method = request.method.toLowerCase()
    const operation = mapRequestMethodToTableAccess(method) // READ, WRITE, DELETE
    const permission = await this.prisma.role.findFirst({
      where: {
        AND: [
          {
            title: {
              in: userRoles.map((role) => role.title),
            },
          },
          {
            permissions: {
              some: {
                AND: [
                  {
                    title: operation,
                  },
                  {
                    table: table,
                  },
                ],
              },
            },
          },
        ],
      },
    })
    return !!permission
  }
}
