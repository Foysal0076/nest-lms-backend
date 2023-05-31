import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { INestApplication, ValidationPipe } from '@nestjs/common'

describe('Course Category integration tests', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init()
    app.listen(3333)
    const prisma = app.get(PrismaService)
    await prisma.cleanDB()
    pactum.request.setBaseUrl('http://localhost:3333')
  })

  //teardown logic
  afterAll(() => {
    app.close()
  })

  describe('Course Category Service', () => {
    const studentCredential = {
      email: 'student@nestlms.com',
      password: 'password',
      firstName: 'Student',
      lastName: 'User',
    }

    const adminCredential = {
      email: 'admin@nestlms.com',
      password: 'password',
      firstName: 'Admin',
      lastName: 'User',
    }

    const instructorCredential = {
      email: 'admin@nestlms.com',
      password: 'password',
      firstName: 'Admin',
      lastName: 'User',
    }

    it.todo('should signin student user')
    it.todo('should get 401 unauthorized to create course category')
    it.todo('should get 401 unauthorized to update course category')
    it.todo('should get 401 unauthorized to delete course category')

    it.todo('should signin instructor user')
    it.todo('should create course category')
    it.todo(
      'should get 401 unauthorized to update course category not created by the user'
    )
    it.todo('should update course category created by the user')
    it.todo(
      'should get 401 unauthorized to delete course category not created by the user'
    )
    it.todo('should delete course category created by the user')
    it.todo('should create course category')

    it.todo('should signin admin user')
    it.todo('should create new course category')
    it.todo('update course category')
    it.todo('should delete course category')

    it.todo('should get all course categories by any user')
  })
})
