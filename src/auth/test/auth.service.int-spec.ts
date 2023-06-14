import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { TEST_USER_DATA } from 'src/utils/constants'

describe('TodoService Int', () => {
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

  describe('Auth Service', () => {
    it('should signup user', async () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(TEST_USER_DATA)
        .expectStatus(201)
        .expectJsonLike({ accessToken: /.+/ })
    })

    it('should signin user', async () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          email: TEST_USER_DATA.email,
          password: TEST_USER_DATA.password,
        })
        .expectStatus(200)
        .stores('accessToken', 'accessToken')
    })
  })
})
