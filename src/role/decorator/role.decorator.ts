import { SetMetadata } from '@nestjs/common'

export const Roles = (table: string) => SetMetadata('table', table)
