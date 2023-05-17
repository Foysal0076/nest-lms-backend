import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  cleanDB() {
    // $transaction will make sure the codes execute in order
    return this.$transaction([this.user.deleteMany()])

    //Another way to clean database
    // if (process.env.NODE_ENV === 'production') return
    // const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_')
    // return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()))
  }
}
