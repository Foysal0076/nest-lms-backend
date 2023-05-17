import { Global, Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Global() //This will make this module available to all other modules
@Module({
  providers: [PrismaService],
  exports: [],
})
export class PrismaModule {}
