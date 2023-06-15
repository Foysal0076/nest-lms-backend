import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient, TableAccess } from '@prisma/client'

type SchemaTable = {
  table_name: string
}

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

  async cleanDB() {
    // $transaction will make sure the codes execute in order
    // return this.$transaction([this.user.deleteMany()])
    //Another way to clean database
    // if (process.env.NODE_ENV === 'production') return
    // const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_')
    // return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()))
    const unchangedTableNames = ['User', 'Role', 'Permission']
    let allTables: SchemaTable[] = await this
      .$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    allTables = allTables.filter((table) => table.table_name.at(0) !== '_')
    let tableNames = allTables.map((table) => table.table_name)
    //filter tableNames to remove unchangedTableNames
    tableNames = tableNames.filter(
      (tableName) => !unchangedTableNames.includes(tableName)
    )
    //delete all the data in the database
    for await (const tableName of tableNames) {
      await this[tableName].deleteMany()
    }
  }

  async cleanTestUsers(userEmails: string[]) {
    await this.user.deleteMany({
      where: {
        email: {
          in: userEmails,
        },
      },
    })
  }

  async cleanTestRoles(roleTitles: string[]) {
    await this.role.deleteMany({
      where: {
        title: {
          in: roleTitles,
        },
      },
    })
  }

  async cleanTestPermissions(
    permissionTitles: TableAccess[],
    tableName: string
  ) {
    await this.permission.deleteMany({
      where: {
        AND: [
          {
            title: {
              in: permissionTitles,
            },
          },
          {
            table: tableName,
          },
        ],
      },
    })
  }

  static getModels() {
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_')
    return Promise.all(models.map((modelKey) => this[modelKey]))
  }
}
