import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { SignupDto } from 'src/auth/dto'
import { UpdateProfileDto, UpdateUserDto } from 'src/user/dto'

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

    const updateProfileData: UpdateProfileDto = {
      addressLine1: '1234 Test St',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
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
      email: 'update@email.com',
      password: 'UpdatedPassword',
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
    })

    it('should signin with updated user credential', async () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          email: updateUserData.email,
          password: updateUserData.password,
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(200)
        .stores('accessToken', 'accessToken')
    })

    it('should get user profile', async () => {
      return pactum
        .spec()
        .get('/user/profile')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(200)
      // .inspect()
    })

    it('should not update user profile, expect 400 bad request', async () => {
      return pactum
        .spec()
        .patch('/user/profile')
        .withBody({})
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(400)
      // .inspect()
    })

    it('should update user profile', async () => {
      return pactum
        .spec()
        .patch('/user/profile')
        .withBody(updateProfileData)
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(200)
        .expectBodyContains(updateProfileData.addressLine1)
        .expectBodyContains(updateProfileData.city)
        .expectBodyContains(updateProfileData.state)
        .expectBodyContains(updateProfileData.zipCode)
      // .inspect()
    })
  })
})
