import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { SignupDto } from 'src/auth/dto'
import { UpdateUserDto } from 'src/user/dto'

describe('User service integration tests', () => {
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

  describe('User Service', () => {
    const signupData: SignupDto = {
      email: 'testuser@test.com',
      password: '1234',
      firstName: 'Test',
      lastName: 'User',
    }

    it('should signup user', async () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(signupData)
        .expectStatus(201)
        .expectJsonLike({ accessToken: /.+/ })
    })

    const updateUserData: UpdateUserDto = {
      firstName: 'Updated',
      lastName: 'User',
    }

    it('should signin user', async () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({ email: signupData.email, password: signupData.password })
        .expectStatus(200)
        .stores('accessToken', 'accessToken')
    })

    it('should update user', async () => {
      return pactum
        .spec()
        .patch('/user')
        .withBody(updateUserData)
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(200)
        .expectBodyContains(updateUserData.firstName)
        .expectBodyContains(updateUserData.lastName)
    })
  })
})
