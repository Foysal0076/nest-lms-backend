import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { CreateCourseTagDto } from 'src/course-tag/dto'
import { ADMIN_DATA, INSTRUCTOR_DATA, STUDENT_DATA } from 'src/utils/constants'

describe('Course Tag integration tests', () => {
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

  describe('Course Tag Service', () => {
    const courseTagData: CreateCourseTagDto = {
      title: 'Design',
    }

    // it.todo('should signin admin user')
    // it.todo('should create a new course tag')
    // it.todo('update course tag')
    // it.todo('should delete any course tag')
    // it.todo('should create multiple course tags')
    // it.todo('should delete multiple course tags')

    // it.todo('should signin student user')
    // it.todo(
    //   'should get 401 unauthorized to create course tag for student user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to update course tag for student user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to delete course tag for student user'
    // )

    // it.todo('should signin instructor user')
    // it.todo('should create course tag')
    // it.todo(
    //   'should get 401 unauthorized to update course tag not created by the instructor user'
    // )
    // it.todo(
    //   'should update course tag created by the authenticated instructor user'
    // )
    // it.todo(
    //   'should delete course tag created by the authenticated instructor user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to delete course tag not created by the authenticated user'
    // )
    // it.todo('admin should be able to delete course tag created by other user')

    // it.todo('should get all course tags by any user')
    // it.todo('should get course tag by search query by any user')
    // it.todo('should get empty course tag by search query by any user with a query that is not in the database')

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

    it('should create a new course tag', () => {
      return pactum
        .spec()
        .post('/course-tags')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody(courseTagData)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(courseTagData.title)
        .stores('adminCourseTagId', 'id')
      // .inspect()
    })

    it('update course tag', () => {
      return pactum
        .spec()
        .patch('/course-tags/{id}')
        .withPathParams('id', '$S{adminCourseTagId}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({ title: 'Updated Design' })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Updated Design')
    })

    it('should delete any course tag', () => {
      return pactum
        .spec()
        .delete('/course-tags/{id}')
        .withPathParams('id', '$S{adminCourseTagId}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })

    it('should create a new course tag', () => {
      return pactum
        .spec()
        .post('/course-tags')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody(courseTagData)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(courseTagData.title)
        .stores('adminCourseTagId', 'id')
      // .inspect()
    })

    it('should create a new course tag', () => {
      return pactum
        .spec()
        .post('/course-tags')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({ title: 'Test 2' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test 2')
        .stores('adminCourseTagId2', 'id')
    })

    it('should create a new course tag', () => {
      return pactum
        .spec()
        .post('/course-tags')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({ title: 'Test 3' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test 3')
        .stores('adminCourseTagId3', 'id')
    })

    it('should delete multiple course tags', () => {
      return pactum
        .spec()
        .delete('/course-tags')
        .withBody({
          ids: ['$S{adminCourseTagId}', '$S{adminCourseTagId2}'],
        })
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })

    it('should get 404 Bad Request fail to delete multiple course tags with invalid tag ids', () => {
      return pactum
        .spec()
        .delete('/course-tags')
        .withBody({
          ids: ['$S{adminCourseTagId3}', 111, 222, 333],
        })
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.NOT_FOUND)
    })

    it('should get 400 Bad Request error to delete multiple course tags with empty tag ids', () => {
      return pactum
        .spec()
        .delete('/course-tags')
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

    it('should get 403 Forbidden to create course tag created by other user', () => {
      return pactum
        .spec()
        .post('/course-tags')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({ title: 'Test student tag 1' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 403 Forbidden to update course tag created by other user', () => {
      return pactum
        .spec()
        .patch('/course-tags/{id}')
        .withPathParams('id', '$S{adminCourseTagId3}')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({ title: 'Updated Design' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 403 Forbidden to delete course tag created by other user', () => {
      return pactum
        .spec()
        .delete('/course-tags/{id}')
        .withPathParams('id', '$S{adminCourseTagId3}')
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

    it('should create a new course tag', () => {
      return pactum
        .spec()
        .post('/course-tags')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({ title: 'Test instructor tag 1' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test instructor tag 1')
        .stores('instructorCourseTagId1', 'id')
    })

    it('should create a new course tag', () => {
      return pactum
        .spec()
        .post('/course-tags')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({ title: 'Test instructor tag 2' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test instructor tag 2')
        .stores('instructorCourseTagId2', 'id')
    })

    it('should create a new course tag', () => {
      return pactum
        .spec()
        .post('/course-tags')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({ title: 'Test instructor tag 3' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test instructor tag 3')
        .stores('instructorCourseTagId3', 'id')
    })

    it('should get 403 Forbidden to update course tag not created by the instructor user', () => {
      return pactum
        .spec()
        .patch('/course-tags/{id}')
        .withPathParams('id', '$S{adminCourseTagId3}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({ title: 'Updated Design' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should update course tag created by the authenticated instructor user', () => {
      return pactum
        .spec()
        .patch('/course-tags/{id}')
        .withPathParams('id', '$S{instructorCourseTagId1}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({ title: 'Updated Test instructor tag 1' })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Updated Test instructor tag 1')
    })

    it("should get 403 forbidden to delete course tag, even though it's been created by the authenticated instructor user", () => {
      return pactum
        .spec()
        .delete('/course-tags/{id}')
        .withPathParams('id', '$S{instructorCourseTagId1}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 403 forbidden to delete course tag not created by the authenticated user', () => {
      return pactum
        .spec()
        .delete('/course-tags/{id}')
        .withPathParams('id', '$S{adminCourseTagId3}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('admin should be able to delete course tag created by other user', () => {
      return pactum
        .spec()
        .delete('/course-tags/{id}')
        .withPathParams('id', '$S{instructorCourseTagId2}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })

    it('should get all course tags by any user', () => {
      return pactum.spec().get('/course-tags').expectStatus(HttpStatus.OK)
    })

    it('should get course tag by search query by any user', () => {
      return pactum
        .spec()
        .get('/course-tags?search=3')
        .expectStatus(HttpStatus.OK)
      // .inspect()
    })

    it('should get empty course tag array by search query by any user', () => {
      return pactum
        .spec()
        .get('/course-tags?search=nothing')
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ results: [] })
      // .inspect()
    })
  })
})
