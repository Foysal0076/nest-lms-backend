import { PrismaClient, TableAccess } from '@prisma/client'
import * as argon from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const tables = ['User', 'Role', 'Permission', 'UserProfile']

  //delete all the data in the database
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
    prisma.permission.deleteMany(),
  ])

  const permissionIds: number[] = []

  const adminRole = await prisma.role.upsert({
    where: { title: 'Admin' },
    update: {},
    create: {
      title: 'Admin',
      description: 'This is the admin role',
    },
  })

  // create and assign permission to admin for each table
  for (const tableName of tables) {
    const writePermission = await prisma.permission.create({
      data: {
        title: TableAccess.WRITE,
        table: tableName,
        description: `This permission allows WRITE access to the ${tableName} table`,
      },
    })
    permissionIds.push(writePermission.id)

    const readPermission = await prisma.permission.create({
      data: {
        title: TableAccess.READ,
        table: tableName,
        description: `This permission allows READ access to the ${tableName} table`,
      },
    })

    permissionIds.push(readPermission.id)
  }

  // assign permissions to admin role
  await prisma.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        connect: permissionIds.map((id) => ({ id })),
      },
    },
  })

  // const permission = await prisma.permission.upsert({
  //   where: {},
  //   update: {},
  //   create: {
  //     title: TableAccess.WRITE,
  //     table: 'User',
  //     description: 'This permission allows to write access to the User table',
  //     roles: {
  //       create: [
  //         {
  //           title: 'Admin',
  //           description:
  //             'This role allows the user to do anything on the database',
  //         },
  //       ],
  //     },
  //   },
  // })

  // const adminRole = await prisma.role.upsert({
  //   where: { title: 'Admin' },
  //   update: {},
  //   create: {
  //     title: 'Admin',
  //     description: 'This is the admin role',
  //     permissions: {
  //       connect: {
  //         id: permission.id,
  //       },
  //     },
  //   },
  // })

  const adminData = {
    email: 'admin@nestlms.com',
    password: await argon.hash('password'),
    firstName: 'Admin',
    lastName: 'User',
    phone: '1234567890',
  }

  await prisma.user.upsert({
    where: { email: adminData.email },
    update: {},
    create: {
      email: adminData.email,
      password: adminData.password,
      phone: adminData.phone,
      roles: {
        connect: {
          id: adminRole.id,
        },
      },
      userProfile: {
        create: {
          firstName: adminData.firstName,
          lastName: adminData.lastName,
        },
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
  })
