import { PrismaClient } from '@prisma/client'
import * as argon from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const permission = await prisma.permission.upsert({
    where: { title: 'Do Anything' },
    update: {},
    create: {
      title: 'Do Anything',
      description: 'This permission allows the user to do anything',
      roles: {
        create: [
          {
            title: 'Admin',
            description: 'This role allows the user to do anything',
          },
        ],
      },
    },
  })

  const adminRole = await prisma.role.upsert({
    where: { title: 'Admin' },
    update: {},
    create: {
      title: 'Admin',
      description: 'This is the admin role',
      permissions: {
        connect: {
          id: permission.id,
        },
      },
    },
  })

  const adminData = {
    email: 'admin@nestlms.com',
    password: await argon.hash('password'),
    firstName: 'Admin',
    lastName: 'User',
    phone: '1234567890',
  }

  const admin = await prisma.user.upsert({
    where: { email: adminData.email },
    update: {},
    create: {
      email: adminData.email,
      password: adminData.password,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      phone: adminData.phone,
      roles: {
        connect: {
          id: adminRole.id,
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
    await prisma.$disconnect()
    process.exit(1)
  })
