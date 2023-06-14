import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { AuthUser } from 'src/utils/types'

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest()
    if (data) {
      return request.user[data]
    }
    return request.user as AuthUser
  }
)
