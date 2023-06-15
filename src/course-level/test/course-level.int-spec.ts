import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { CreateCourseLevelDto } from 'src/course-level/dto'
import { ADMIN_DATA, INSTRUCTOR_DATA, STUDENT_DATA } from 'src/utils/constants'

describe('Course Level integration tests', () => {
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

  describe('Course Level Service', () => {
    const courseLevelData: CreateCourseLevelDto = {
      title: 'Design',
    }

    // it.todo('should signin admin user')
    // it.todo('should create a new course level')
    // it.todo('update course level')
    // it.todo('should delete any course level')
    // it.todo('should create multiple course levels')
    // it.todo('should delete multiple course levels')

    // it.todo('should signin student user')
    // it.todo(
    //   'should get 401 unauthorized to create course level for student user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to update course level for student user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to delete course level for student user'
    // )

    // it.todo('should signin instructor user')
    // it.todo('should create course level')
    // it.todo(
    //   'should get 401 unauthorized to update course level not created by the instructor user'
    // )
    // it.todo(
    //   'should update course level created by the authenticated instructor user'
    // )
    // it.todo(
    //   'should delete course level created by the authenticated instructor user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to delete course level not created by the authenticated user'
    // )

    // it.todo('should get all course levels by any user')
    // it.todo('should get course level by search query by any user')
    // it.todo('should get empty course level by search query by any user with a query that is not in the database')

    it('should signin admin user', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          email: ADMIN_DATA.email,
          password: ADMIN_DATA.password,
        })
        .expectStatus(200)
        .stores('adminAccessToken', 'accessToken')
    })

    it('should create a new course level', () => {
      return pactum
        .spec()
        .post('/course-levels')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody(courseLevelData)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(courseLevelData.title)
        .stores('adminCourseLevelId', 'id')
      // .inspect()
    })

    it('update course level', () => {
      return pactum
        .spec()
        .patch('/course-levels/{id}')
        .withPathParams('id', '$S{adminCourseLevelId}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({ title: 'Updated Design' })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Updated Design')
    })

    it('should delete any course level', () => {
      return pactum
        .spec()
        .delete('/course-levels/{id}')
        .withPathParams('id', '$S{adminCourseLevelId}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })

    it('should create a new course level', () => {
      return pactum
        .spec()
        .post('/course-levels')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody(courseLevelData)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(courseLevelData.title)
        .stores('adminCourseLevelId', 'id')
      // .inspect()
    })

    it('should create a new course level', () => {
      return pactum
        .spec()
        .post('/course-levels')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({ title: 'Test 2' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test 2')
        .stores('adminCourseLevelId2', 'id')
    })

    it('should create a new course level', () => {
      return pactum
        .spec()
        .post('/course-levels')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({ title: 'Test 3' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test 3')
        .stores('adminCourseLevelId3', 'id')
    })

    it('should delete multiple course levels', () => {
      return pactum
        .spec()
        .delete('/course-levels')
        .withBody({
          ids: ['$S{adminCourseLevelId}', '$S{adminCourseLevelId2}'],
        })
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })

    it('should get 404 Bad Request fail to delete multiple course levels with invalid level ids', () => {
      return pactum
        .spec()
        .delete('/course-levels')
        .withBody({
          ids: ['$S{adminCourseLevelId3}', 111, 222, 333],
        })
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.NOT_FOUND)
    })

    it('should get 400 Bad Request error to delete multiple course levels with empty level ids', () => {
      return pactum
        .spec()
        .delete('/course-levels')
        .withBody({
          ids: [],
        })
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.BAD_REQUEST)
    })

    it('should signin student user', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          email: STUDENT_DATA.email,
          password: STUDENT_DATA.password,
        })
        .expectStatus(200)
        .stores('studentAccessToken', 'accessToken')
    })

    it('should get 403 Forbidden to create course level created by other user', () => {
      return pactum
        .spec()
        .post('/course-levels')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({ title: 'Test student level 1' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 403 Forbidden to update course level created by other user', () => {
      return pactum
        .spec()
        .patch('/course-levels/{id}')
        .withPathParams('id', '$S{adminCourseLevelId3}')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({ title: 'Updated Design' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 403 Forbidden to delete course level created by other user', () => {
      return pactum
        .spec()
        .delete('/course-levels/{id}')
        .withPathParams('id', '$S{adminCourseLevelId3}')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should signin instructor user', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          email: INSTRUCTOR_DATA.email,
          password: INSTRUCTOR_DATA.password,
        })
        .expectStatus(200)
        .stores('instructorAccessToken', 'accessToken')
    })

    it('should create a new course level', () => {
      return pactum
        .spec()
        .post('/course-levels')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({ title: 'Test instructor level 1' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test instructor level 1')
        .stores('instructorCourseLevelId1', 'id')
    })

    it('should create a new course level', () => {
      return pactum
        .spec()
        .post('/course-levels')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({ title: 'Test instructor level 2' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test instructor level 2')
        .stores('instructorCourseLevelId2', 'id')
    })

    it('should create a new course level', () => {
      return pactum
        .spec()
        .post('/course-levels')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({ title: 'Test instructor level 3' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test instructor level 3')
        .stores('instructorCourseLevelId3', 'id')
    })

    it('should get 403 Forbidden to update course level not created by the instructor user', () => {
      return pactum
        .spec()
        .patch('/course-levels/{id}')
        .withPathParams('id', '$S{adminCourseLevelId3}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({ title: 'Updated Design' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should update course level created by the authenticated instructor user', () => {
      return pactum
        .spec()
        .patch('/course-levels/{id}')
        .withPathParams('id', '$S{instructorCourseLevelId1}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({ title: 'Updated Test instructor level 1' })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Updated Test instructor level 1')
    })

    it("should get 403 forbidden to delete course level, even though it's been created by the authenticated instructor user", () => {
      return pactum
        .spec()
        .delete('/course-levels/{id}')
        .withPathParams('id', '$S{instructorCourseLevelId1}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 403 forbidden to delete course level not created by the authenticated user', () => {
      return pactum
        .spec()
        .delete('/course-levels/{id}')
        .withPathParams('id', '$S{adminCourseLevelId3}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('admin should be able to delete course level created by other user', () => {
      return pactum
        .spec()
        .delete('/course-levels/{id}')
        .withPathParams('id', '$S{instructorCourseLevelId2}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })

    it('should get all course levels by any user', () => {
      return pactum.spec().get('/course-levels').expectStatus(HttpStatus.OK)
    })

    it('should get course level by search query by any user', () => {
      return pactum
        .spec()
        .get('/course-levels?search=3')
        .expectStatus(HttpStatus.OK)
      // .inspect()
    })

    it('should get empty course level array by search query by any user', () => {
      return pactum
        .spec()
        .get('/course-levels?search=nothing')
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ results: [] })
      // .inspect()
    })
  })
})
