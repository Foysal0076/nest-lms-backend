import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { CreateBlogCategoryDto } from 'src/blog-category/dto'
import { ADMIN_DATA, INSTRUCTOR_DATA, STUDENT_DATA } from 'src/utils/constants'

describe('Blog Category integration tests', () => {
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

  describe('Blog Category Service', () => {
    const blogCategoryData: CreateBlogCategoryDto = {
      title: 'Design',
    }

    // const blogCategoriesData: CreateBlogCategoryDto[] = [
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
    // it.todo('should create a new blog category')
    // it.todo('update blog category')
    // it.todo('should delete any blog category')
    // it.todo('should create multiple blog categories')
    // it.todo('should delete multiple blog categories')

    // it.todo('should signin student user')
    // it.todo(
    //   'should get 401 unauthorized to create blog category for student user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to update blog category for student user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to delete blog category for student user'
    // )

    // it.todo('should signin instructor user')
    // it.todo('should create blog category')
    // it.todo(
    //   'should get 401 unauthorized to update blog category not created by the instructor user'
    // )
    // it.todo(
    //   'should update blog category created by the authenticated instructor user'
    // )
    // it.todo(
    //   'should delete blog category created by the authenticated instructor user'
    // )
    // it.todo(
    //   'should get 401 unauthorized to delete blog category not created by the authenticated user'
    // )

    // it.todo('should get all blog categories by any user')
    // it.todo('should get blog category by search query by any user')
    // it.todo('should get empty blog category by search query by any user with a query that is not in the database')

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

    it('should create a new blog category', () => {
      return pactum
        .spec()
        .post('/blog-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody(blogCategoryData)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(blogCategoryData.title)
        .stores('adminBlogCategoryId', 'id')
      // .inspect()
    })

    it('update blog category', () => {
      return pactum
        .spec()
        .patch('/blog-categories/{id}')
        .withPathParams('id', '$S{adminBlogCategoryId}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Updated Design' })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Updated Design')
    })

    it('should delete any blog category', () => {
      return pactum
        .spec()
        .delete('/blog-categories/{id}')
        .withPathParams('id', '$S{adminBlogCategoryId}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })

    it('should create a new blog category', () => {
      return pactum
        .spec()
        .post('/blog-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody(blogCategoryData)
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains(blogCategoryData.title)
        .stores('adminBlogCategoryId', 'id')
      // .inspect()
    })

    it('should create a new blog category', () => {
      return pactum
        .spec()
        .post('/blog-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Test 2' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test 2')
        .stores('adminBlogCategoryId2', 'id')
    })

    it('should create a new blog category', () => {
      return pactum
        .spec()
        .post('/blog-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Test 3' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test 3')
        .stores('adminBlogCategoryId3', 'id')
    })

    it('should delete multiple blog categories', () => {
      return pactum
        .spec()
        .delete('/blog-categories')
        .withBody({
          ids: ['$S{adminBlogCategoryId}', '$S{adminBlogCategoryId2}'],
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })

    it('should get 404 Bad Request fail to delete multiple blog categories with invalid category ids', () => {
      return pactum
        .spec()
        .delete('/blog-categories')
        .withBody({
          ids: ['$S{adminBlogCategoryId3}', 111, 222, 333],
        })
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.NOT_FOUND)
    })

    it('should get 400 Not Found error to delete multiple blog categories with empty category ids', () => {
      return pactum
        .spec()
        .delete('/blog-categories')
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

    it('should get 201 status to create blog category for student user', () => {
      return pactum
        .spec()
        .post('/blog-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Test student category 1' })
        .expectStatus(HttpStatus.CREATED)
        .stores('studentBlogCategoryId1', 'id')
    })

    it('should get 403 Forbidden to update blog category by student user that was created by other user', () => {
      return pactum
        .spec()
        .patch('/blog-categories/{id}')
        .withPathParams('id', '$S{adminBlogCategoryId3}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Updated Student Category Name' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should update blog category by student user that was created by student user', () => {
      return pactum
        .spec()
        .patch('/blog-categories/{id}')
        .withPathParams('id', '$S{studentBlogCategoryId1}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Updated Student Category Name' })
        .expectStatus(HttpStatus.OK)
    })

    it('should get 403 Forbidden to delete blog category by student user that was created by other user', () => {
      return pactum
        .spec()
        .delete('/blog-categories/{id}')
        .withPathParams('id', '$S{adminBlogCategoryId3}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 403 Forbidden to delete blog category by student user that was created by student user', () => {
      return pactum
        .spec()
        .delete('/blog-categories/{id}')
        .withPathParams('id', '$S{studentBlogCategoryId1}')
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

    it('should create a new blog category', () => {
      return pactum
        .spec()
        .post('/blog-categories')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Test instructor category 1' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Test instructor category 1')
        .stores('instructorBlogCategoryId1', 'id')
    })

    it('should get 403 Forbidden to update blog category not created by the instructor user', () => {
      return pactum
        .spec()
        .patch('/blog-categories/{id}')
        .withPathParams('id', '$S{adminBlogCategoryId3}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Updated Design' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should update blog category created by the authenticated instructor user', () => {
      return pactum
        .spec()
        .patch('/blog-categories/{id}')
        .withPathParams('id', '$S{instructorBlogCategoryId1}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .withBody({ title: 'Updated Test instructor category 1' })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Updated Test instructor category 1')
    })

    it("should get 403 forbidden to delete blog category, even though it's been created by the authenticated instructor user", () => {
      return pactum
        .spec()
        .delete('/blog-categories/{id}')
        .withPathParams('id', '$S{instructorBlogCategoryId1}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 403 forbidden to delete blog category not created by the authenticated user', () => {
      return pactum
        .spec()
        .delete('/blog-categories/{id}')
        .withPathParams('id', '$S{adminBlogCategoryId3}')
        .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get all blog categories by any user', () => {
      return pactum.spec().get('/blog-categories').expectStatus(HttpStatus.OK)
    })

    it('should get blog category by search query by any user', () => {
      return pactum
        .spec()
        .get('/blog-categories?search=3')
        .expectStatus(HttpStatus.OK)
      // .inspect()
    })

    it('should get empty blog category array by search query by any user', () => {
      return pactum
        .spec()
        .get('/blog-categories?search=nothing')
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ results: [] })
      // .inspect()
    })
  })
})
