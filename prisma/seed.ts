import { PrismaClient, TableAccess } from '@prisma/client'
import * as argon from 'argon2'

const prisma = new PrismaClient()

type SchemaTable = {
  table_name: string
}

async function main() {
  let allTables: SchemaTable[] =
    await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`

  allTables = allTables.filter((table) => table.table_name.at(0) !== '_')

  const tableNames = allTables.map((table) => table.table_name)

  //delete all the data in the database
  for await (const tableName of tableNames) {
    await prisma[tableName].deleteMany()
  }

  // await prisma.$transaction([
  //   prisma.user.deleteMany(),
  //   prisma.role.deleteMany(),
  //   prisma.permission.deleteMany(),
  // ])

  const permissionIds: number[] = []

  const adminRole = await prisma.role.upsert({
    where: { title: 'Admin' },
    update: {},
    create: {
      title: 'Admin',
      description: 'This is the admin role',
    },
  })

  const studentRole = await prisma.role.upsert({
    where: { title: 'Student' },
    update: {},
    create: {
      title: 'Student',
      description: 'This is the general and default role of a user',
    },
  })

  const instructorRole = await prisma.role.upsert({
    where: { title: 'Instructor' },
    update: {},
    create: {
      title: 'Instructor',
      description: 'An instructor can create courses and lessons',
    },
  })

  // create and assign permission to admin for each table
  for (const tableName of tableNames) {
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
    isVerified: true,
  }

  const studentData = {
    email: 'student@nestlms.com',
    password: await argon.hash('password'),
    firstName: 'Student',
    lastName: 'User',
    phone: '1234567890',
  }

  const instructorData = {
    email: 'instructor@nestlms.com',
    password: await argon.hash('password'),
    firstName: 'Instructor',
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
      isVerified: adminData.isVerified,
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

  await prisma.user.upsert({
    where: { email: studentData.email },
    update: {},
    create: {
      email: studentData.email,
      password: studentData.password,
      phone: studentData.phone,
      roles: {
        connect: {
          id: studentRole.id,
        },
      },
      userProfile: {
        create: {
          firstName: studentData.firstName,
          lastName: studentData.lastName,
        },
      },
    },
  })

  await prisma.user.upsert({
    where: { email: instructorData.email },
    update: {},
    create: {
      email: instructorData.email,
      password: instructorData.password,
      phone: instructorData.phone,
      roles: {
        connect: {
          id: instructorRole.id,
        },
      },
      userProfile: {
        create: {
          firstName: instructorData.firstName,
          lastName: instructorData.lastName,
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
