import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { INestApplication, ValidationPipe } from '@nestjs/common'

describe('Blog Comment integration tests', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init()
    await app.listen(3333)
    const prisma = app.get(PrismaService)
    await prisma.cleanDB()
    pactum.request.setBaseUrl('http://localhost:3333')
  })

  //teardown logic
  afterAll(async () => {
    await app.close()
  })

  describe('Blog Comment Service', () => {
    it.todo('should signin admin user')
    it.todo('should signin student user')
    it.todo('should signin instructor user')

    //Admin
    it.todo('should create a blog comment')
    it.todo('should block any comment')
    it.todo('should delete a comment')
    it.todo('should delete a comment created by any user')
    it.todo('should update a comment')
    it.todo('should update a comment created by any user')

    //Student
    it.todo('should create a blog comment')
    it.todo('should update a comment')
    it.todo('should delete a comment')
    it.todo('should get Forbidden to delete a comment created by other user')
    it.todo('should get Forbidden error when blocking a comment')
    it.todo(
      'should get Forbidden error when deleting a comment created by other user'
    )

    //Instructor
    it.todo('should create a blog comment ')
    it.todo('should update a comment')
    it.todo('should delete a comment')
    it.todo('should get Forbidden error when blocking a comment ')
  })
})
