import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { CreateCourseCategoryDto } from 'src/course-category/dto'
import { ADMIN_DATA, INSTRUCTOR_DATA, STUDENT_DATA } from 'src/utils/constants'

describe('Course Category integration tests', () => {
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

  describe('Course Category Service', () => {
    const courseCategoryData: CreateCourseCategoryDto = {
      title: 'Design',
    }

    // const courseCategoriesData: CreateCourseCategoryDto[] = [
    //   {
    //     title: 'Design',
    //   },
    //   {
    //     title: 'Software Development',
    //   },
    //   {
    //     title: 'Development',
    //   },
    //   {
    //     title: 'Mental Health',
    //   },
    // ]

    // it.todo('should signin admin user')
    // it.todo('should create a new course category')
    // it.todo('update course category')
    // it.todo('should delete any course category')
    // it.todo('should create multiple course categories')
    // it.todo('should delete multiple course categories')

    // it.todo('should signin student user')
    // it.todo(
    //   'should get 401 unauthorized to create course category for student user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to update course category for student user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to delete course category for student user'
    // )

    // it.todo('should signin instructor user')
    // it.todo('should create course category')
    // it.todo(
    //   'should get 401 unauthorized to update course category not created by the instructor user'
    // )
    // it.todo(
    //   'should update course category created by the authenticated instructor user'
    // )
    // it.todo(
    //   'should delete course category created by the authenticated instructor user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to delete course category not created by the authenticated user'
    // )

    // it.todo('should get all course categories by any user')
    // it.todo('should get course category by search query by any user')
    // it.todo('should get empty course category by search query by any user with a query that is not in the database')

    it('should signin admin user', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          email: ADMIN_DATA.email,
          password: ADMIN_DATA.password,
        })
        .expectStatus(200)
        .stores('accessToken', 'accessToken')
    })

    it('should create a new course category', () => {
      return pactum
        .spec()
        .post('/course-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody(courseCategoryData)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(courseCategoryData.title)
        .stores('adminCourseCategoryId', 'id')
      // .inspect()
    })

    it('update course category', () => {
      return pactum
        .spec()
        .patch('/course-categories/{id}')
        .withPathParams('id', '$S{adminCourseCategoryId}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Updated Design' })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Updated Design')
    })

    it('should delete any course category', () => {
      return pactum
        .spec()
        .delete('/course-categories/{id}')
        .withPathParams('id', '$S{adminCourseCategoryId}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })

    it('should create a new course category', () => {
      return pactum
        .spec()
        .post('/course-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody(courseCategoryData)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(courseCategoryData.title)
        .stores('adminCourseCategoryId', 'id')
      // .inspect()
    })

    it('should create a new course category', () => {
      return pactum
        .spec()
        .post('/course-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Test 2' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test 2')
        .stores('adminCourseCategoryId2', 'id')
    })

    it('should create a new course category', () => {
      return pactum
        .spec()
        .post('/course-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Test 3' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test 3')
        .stores('adminCourseCategoryId3', 'id')
    })

    it('should delete multiple course categories', () => {
      return pactum
        .spec()
        .delete('/course-categories')
        .withBody({
          ids: ['$S{adminCourseCategoryId}', '$S{adminCourseCategoryId2}'],
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })

    it('should get 404 Bad Request fail to delete multiple course categories with invalid category ids', () => {
      return pactum
        .spec()
        .delete('/course-categories')
        .withBody({
          ids: ['$S{adminCourseCategoryId3}', 111, 222, 333],
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.NOT_FOUND)
    })

    it('should get 400 Not Found error to delete multiple course categories with empty category ids', () => {
      return pactum
        .spec()
        .delete('/course-categories')
        .withBody({
          ids: [],
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
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
        .stores('accessToken', 'accessToken')
    })

    it('should get 403 Forbidden to create course category for student user', () => {
      return pactum
        .spec()
        .post('/course-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Test student category 1' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 403 Forbidden to update course category for student user', () => {
      return pactum
        .spec()
        .patch('/course-categories/{id}')
        .withPathParams('id', '$S{adminCourseCategoryId3}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Updated Design' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 403 Forbidden to delete course category for student user', () => {
      return pactum
        .spec()
        .delete('/course-categories/{id}')
        .withPathParams('id', '$S{adminCourseCategoryId3}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
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
        .stores('accessToken', 'accessToken')
    })

    it('should create a new course category', () => {
      return pactum
        .spec()
        .post('/course-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Test instructor category 1' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test instructor category 1')
        .stores('instructorCourseCategoryId1', 'id')
    })

    it('should get 403 Forbidden to update course category not created by the instructor user', () => {
      return pactum
        .spec()
        .patch('/course-categories/{id}')
        .withPathParams('id', '$S{adminCourseCategoryId3}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Updated Design' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should update course category created by the authenticated instructor user', () => {
      return pactum
        .spec()
        .patch('/course-categories/{id}')
        .withPathParams('id', '$S{instructorCourseCategoryId1}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Updated Test instructor category 1' })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Updated Test instructor category 1')
    })

    it("should get 403 forbidden to delete course category, even though it's been created by the authenticated instructor user", () => {
      return pactum
        .spec()
        .delete('/course-categories/{id}')
        .withPathParams('id', '$S{instructorCourseCategoryId1}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 403 forbidden to delete course category not created by the authenticated user', () => {
      return pactum
        .spec()
        .delete('/course-categories/{id}')
        .withPathParams('id', '$S{adminCourseCategoryId3}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get all course categories by any user', () => {
      return pactum.spec().get('/course-categories').expectStatus(HttpStatus.OK)
    })

    it('should get course category by search query by any user', () => {
      return pactum
        .spec()
        .get('/course-categories?search=3')
        .expectStatus(HttpStatus.OK)
      // .inspect()
    })

    it('should get empty course category array by search query by any user', () => {
      return pactum
        .spec()
        .get('/course-categories?search=nothing')
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ results: [] })
      // .inspect()
    })
  })
})
