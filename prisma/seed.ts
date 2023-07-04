import { PrismaClient, TableAccess } from '@prisma/client'
import * as argon from 'argon2'

const prisma = new PrismaClient()

type SchemaTable = {
  table_name: string
}

const STUDENT_DATA = {
  email: 'student@nestlms.com',
  password: 'password',
  firstName: 'Student',
  lastName: 'User',
  phone: '1234567890',
  isVerified: true,
}

const ADMIN_DATA = {
  email: 'admin@nestlms.com',
  password: 'password',
  firstName: 'Admin',
  lastName: 'User',
  phone: '1234567890',
  isVerified: true,
}

const INSTRUCTOR_DATA = {
  email: 'instructor@nestlms.com',
  password: 'password',
  firstName: 'Admin',
  lastName: 'User',
  phone: '1234567890',
  isVerified: true,
}

const TEST_USER_DATA = {
  email: 'testuser@nestlms.com',
  password: 'password',
  firstName: 'Test',
  lastName: 'User',
  phone: '1234567890',
  isVerified: true,
}

const studentForbiddenPermissions = [
  {
    table: 'Role',
    title: TableAccess.READ,
  },
  {
    table: 'Role',
    title: TableAccess.DELETE,
  },
  {
    table: 'Role',
    title: TableAccess.WRITE,
  },
  {
    table: 'Permission',
    title: TableAccess.READ,
  },
  {
    table: 'Permission',
    title: TableAccess.DELETE,
  },
  {
    table: 'Permission',
    title: TableAccess.WRITE,
  },
  {
    table: 'User',
    title: TableAccess.DELETE,
  },
  {
    table: 'Certificate',
    title: TableAccess.DELETE,
  },
  {
    table: 'Certificate',
    title: TableAccess.WRITE,
  },
  {
    table: 'Course',
    title: TableAccess.WRITE,
  },
  {
    table: 'Course',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseCategory',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseCategory',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseLevel',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseLevel',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseProvider',
    title: TableAccess.READ,
  },
  {
    table: 'CourseProvider',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseProvider',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseTag',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseTag',
    title: TableAccess.DELETE,
  },
  {
    table: 'Login',
    title: TableAccess.DELETE,
  },
  {
    table: 'Module',
    title: TableAccess.WRITE,
  },
  {
    table: 'Module',
    title: TableAccess.DELETE,
  },
  {
    table: 'Quiz',
    title: TableAccess.WRITE,
  },
  {
    table: 'Quiz',
    title: TableAccess.DELETE,
  },
  {
    table: 'QuizQuestion',
    title: TableAccess.WRITE,
  },
  {
    table: 'QuizQuestion',
    title: TableAccess.DELETE,
  },
  {
    table: 'QuizQuestionOption',
    title: TableAccess.WRITE,
  },
  {
    table: 'QuizQuestionOption',
    title: TableAccess.DELETE,
  },
  {
    table: 'QuizQuestionType',
    title: TableAccess.WRITE,
  },
  {
    table: 'QuizQuestionType',
    title: TableAccess.DELETE,
  },
  {
    table: 'Resource',
    title: TableAccess.WRITE,
  },
  {
    table: 'Resource',
    title: TableAccess.DELETE,
  },
  {
    table: 'ResourceType',
    title: TableAccess.WRITE,
  },
  {
    table: 'ResourceType',
    title: TableAccess.DELETE,
  },
  {
    table: 'QuizType',
    title: TableAccess.WRITE,
  },
  {
    table: 'QuizType',
    title: TableAccess.DELETE,
  },
  {
    table: 'Subscription',
    title: TableAccess.WRITE,
  },
  {
    table: 'Subscription',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionType',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionType',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionProduct',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionProduct',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionProductType',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionProductType',
    title: TableAccess.DELETE,
  },
  {
    table: 'Unit',
    title: TableAccess.WRITE,
  },
  {
    table: 'Unit',
    title: TableAccess.DELETE,
  },
  {
    table: 'UnitType',
    title: TableAccess.WRITE,
  },
  {
    table: 'UnitType',
    title: TableAccess.DELETE,
  },
  {
    table: 'VerificationRequest',
    title: TableAccess.DELETE,
  },
  {
    table: 'BlogCategory',
    title: TableAccess.DELETE,
  },
]

const instructorForbiddenPermissions = [
  {
    table: 'Role',
    title: TableAccess.READ,
  },
  {
    table: 'Role',
    title: TableAccess.DELETE,
  },
  {
    table: 'Role',
    title: TableAccess.WRITE,
  },
  {
    table: 'Permission',
    title: TableAccess.READ,
  },
  {
    table: 'Permission',
    title: TableAccess.DELETE,
  },
  {
    table: 'Permission',
    title: TableAccess.WRITE,
  },
  {
    table: 'User',
    title: TableAccess.DELETE,
  },
  {
    table: 'Certificate',
    title: TableAccess.DELETE,
  },
  {
    table: 'Certificate',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseCategory',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseLevel',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseProvider',
    title: TableAccess.WRITE,
  },
  {
    table: 'CourseProvider',
    title: TableAccess.DELETE,
  },
  {
    table: 'CourseTag',
    title: TableAccess.DELETE,
  },
  {
    table: 'Login',
    title: TableAccess.DELETE,
  },
  {
    table: 'QuizQuestionType',
    title: TableAccess.DELETE,
  },
  {
    table: 'ResourceType',
    title: TableAccess.WRITE,
  },
  {
    table: 'QuizType',
    title: TableAccess.WRITE,
  },
  {
    table: 'Subscription',
    title: TableAccess.WRITE,
  },
  {
    table: 'Subscription',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionType',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionType',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionProduct',
    title: TableAccess.READ,
  },
  {
    table: 'SubscriptionProduct',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionProduct',
    title: TableAccess.DELETE,
  },
  {
    table: 'SubscriptionProductType',
    title: TableAccess.WRITE,
  },
  {
    table: 'SubscriptionProductType',
    title: TableAccess.DELETE,
  },
  {
    table: 'Unit',
    title: TableAccess.WRITE,
  },
  {
    table: 'Unit',
    title: TableAccess.DELETE,
  },
  {
    table: 'UnitType',
    title: TableAccess.WRITE,
  },
  {
    table: 'UnitType',
    title: TableAccess.DELETE,
  },
  {
    table: 'VerificationRequest',
    title: TableAccess.DELETE,
  },
  {
    table: 'BlogCategory',
    title: TableAccess.DELETE,
  },
]

async function main() {
  let allTables: SchemaTable[] =
    await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`

  allTables = allTables.filter((table) => table.table_name.at(0) !== '_')

  const tableNames = allTables.map((table) => table.table_name)

  //delete all the data in the database
  for await (const tableName of tableNames) {
    await prisma[tableName].deleteMany()
  }

  const permissionIds: number[] = []
  const instructorPermissionIds: number[] = []
  const studentPermissionIds: number[] = []

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

  const developerRole = await prisma.role.upsert({
    where: { title: 'Developer' },
    update: {},
    create: {
      title: 'Developer',
      description: 'A developer has access to all the tables',
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
    if (
      !instructorForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.WRITE
      )
    ) {
      instructorPermissionIds.push(writePermission.id)
    }
    if (
      !studentForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.WRITE
      )
    ) {
      studentPermissionIds.push(writePermission.id)
    }

    const readPermission = await prisma.permission.create({
      data: {
        title: TableAccess.READ,
        table: tableName,
        description: `This permission allows READ access to the ${tableName} table`,
      },
    })
    permissionIds.push(readPermission.id)
    if (
      !instructorForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.READ
      )
    ) {
      instructorPermissionIds.push(readPermission.id)
    }
    if (
      !studentForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.READ
      )
    ) {
      studentPermissionIds.push(readPermission.id)
    }

    const deletePermission = await prisma.permission.create({
      data: {
        title: TableAccess.DELETE,
        table: tableName,
        description: `This permission allows DELETE access to the ${tableName} table`,
      },
    })

    permissionIds.push(deletePermission.id)
    if (
      !instructorForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.DELETE
      )
    ) {
      instructorPermissionIds.push(deletePermission.id)
    }
    if (
      !studentForbiddenPermissions.find(
        (permission) =>
          permission.table === tableName &&
          permission.title === TableAccess.DELETE
      )
    ) {
      studentPermissionIds.push(deletePermission.id)
    }
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

  // assign permissions to instructor role
  await prisma.role.update({
    where: { id: instructorRole.id },
    data: {
      permissions: {
        connect: instructorPermissionIds.map((id) => ({ id })),
      },
    },
  })

  // assign permissions to student role
  await prisma.role.update({
    where: { id: studentRole.id },
    data: {
      permissions: {
        connect: studentPermissionIds.map((id) => ({ id })),
      },
    },
  })

  // assign permissions to developer role
  await prisma.role.update({
    where: { id: developerRole.id },
    data: {
      permissions: {
        connect: permissionIds.map((id) => ({ id })),
      },
    },
  })

  await prisma.user.upsert({
    where: { email: ADMIN_DATA.email },
    update: {},
    create: {
      email: ADMIN_DATA.email,
      password: await argon.hash(ADMIN_DATA.password),
      phone: ADMIN_DATA.phone,
      isVerified: ADMIN_DATA.isVerified,
      roles: {
        connect: {
          id: adminRole.id,
        },
      },
      userProfile: {
        create: {
          firstName: ADMIN_DATA.firstName,
          lastName: ADMIN_DATA.lastName,
        },
      },
    },
  })

  await prisma.user.upsert({
    where: { email: STUDENT_DATA.email },
    update: {},
    create: {
      email: STUDENT_DATA.email,
      password: await argon.hash(STUDENT_DATA.password),
      phone: STUDENT_DATA.phone,
      roles: {
        connect: {
          id: studentRole.id,
        },
      },
      userProfile: {
        create: {
          firstName: STUDENT_DATA.firstName,
          lastName: STUDENT_DATA.lastName,
        },
      },
    },
  })

  await prisma.user.upsert({
    where: { email: INSTRUCTOR_DATA.email },
    update: {},
    create: {
      email: INSTRUCTOR_DATA.email,
      password: await argon.hash(INSTRUCTOR_DATA.password),
      phone: INSTRUCTOR_DATA.phone,
      roles: {
        connect: {
          id: instructorRole.id,
        },
      },
      userProfile: {
        create: {
          firstName: INSTRUCTOR_DATA.firstName,
          lastName: INSTRUCTOR_DATA.lastName,
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
