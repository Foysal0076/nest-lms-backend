import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import * as pactum from 'pactum'
import { ADMIN_DATA, INSTRUCTOR_DATA, STUDENT_DATA } from 'src/utils/constants'

describe('Blog', () => {
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

  describe('Blog Service', () => {
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

    it('should create blog category, by admin user', () => {
      return pactum
        .spec()
        .post('/blog-categories')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({ title: 'React Development' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('React Development')
        .stores('blogCategory1Id', 'id')
        .stores('blogCategory1Slug', 'slug')
      // .inspect()
    })

    it('should create blog category, by admin user', () => {
      return pactum
        .spec()
        .post('/blog-categories')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({ title: 'Web Development' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Web Development')
        .stores('blogCategory2Id', 'id')
    })
    it('should create blog category, by admin user', () => {
      return pactum
        .spec()
        .post('/blog-categories')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({ title: 'Javascript' })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Javascript')
        .stores('blogCategory3Id', 'id')
    })

    it('should get error to create blog with empty title/content , by admin user', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({
          title: 'a',
          content: 'b',
          featuredImage: '',
          categories: [],
        })
        .expectStatus(HttpStatus.BAD_REQUEST)
        .inspect()
    })

    it('should create a blog', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({
          title: 'Admin Blog 1',
          content: 'Blog Content',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory1Id}', '$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Admin Blog 1')
        .stores('adminBlog1Id', 'id')
    })

    it('should create a blog', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({
          title: 'Admin Blog 2',
          content: 'Blog Content 2',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Admin Blog 2')
        .stores('adminBlog2Id', 'id')
    })

    it('should get Bad request error with duplicate title', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({
          title: 'Admin Blog 2',
          content: 'Blog Content 2',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.BAD_REQUEST)
      // .inspect()
    })

    it('should update blog', () => {
      return pactum
        .spec()
        .patch('/blogs/$S{adminBlog1Id}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({
          title: 'Admin Blog Updated',
          content: 'Blog Content Updated',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory3Id}'],
        })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Admin Blog Updated')
      // .inspect()
    })

    it('should delete a blog by id', () => {
      return pactum
        .spec()
        .delete('/blogs/{id}')
        .withPathParams('id', '$S{adminBlog1Id}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })

    it('should create blog, by student user', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({
          title: 'Student Blog 1',
          content: 'Blog Content',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory1Id}', '$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Student Blog 1')
        .stores('studentBlog1Id', 'id')
    })
    it('should create blog, by student user', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({
          title: 'Student Blog 2',
          content: 'Blog Content',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory1Id}', '$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Student Blog 2')
        .stores('studentBlog2Id', 'id')
    })
    it('should create blog, by student user', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({
          title: 'Student Blog 3',
          content: 'Blog Content',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory1Id}', '$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Student Blog 3')
        .stores('studentBlog3Id', 'id')
    })
    it('should create blog, by student user', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({
          title: 'Student Blog 4',
          content: 'Blog Content',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory1Id}', '$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Student Blog 4')
        .stores('studentBlog4Id', 'id')
        .stores('studentBlog4Slug', 'slug')
    })
    it('should create blog, by student user', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({
          title: 'Student Blog 5',
          content: 'Blog Content',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory1Id}', '$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Student Blog 5')
        .stores('studentBlog5Id', 'id')
    })
    it('should create blog, by student user', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({
          title: 'Blog 6',
          content: 'Blog Content',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Blog 6')
        .stores('studentBlog6Id', 'id')
    })

    it('should update blog', () => {
      return pactum
        .spec()
        .patch('/blogs/$S{studentBlog1Id}')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({
          title: 'Student Blog Updated',
          content: 'Blog Content Updated',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory3Id}'],
        })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Student Blog Updated')
      // .inspect()
    })
    it('should delete blog', () => {
      return pactum
        .spec()
        .delete('/blogs/{id}')
        .withPathParams('id', '$S{studentBlog1Id}')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })
    it('should get forbidden to delete a blog created by another student/user', () => {
      return pactum
        .spec()
        .delete('/blogs/{id}')
        .withPathParams('id', '$S{adminBlog2Id}')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })
    it('should get forbidden to update a blog created by another student/user', () => {
      return pactum
        .spec()
        .patch('/blogs/$S{adminBlog2Id}')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .withBody({
          title: 'Student Blog Updated 2',
          content: 'Blog Content Updated',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory3Id}'],
        })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should create blog, by instructor user', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({
          title: 'Instructor Blog 1',
          content: 'Blog Content',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory1Id}', '$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Instructor Blog 1')
        .stores('instructorBlog1Id', 'id')
    })
    it('should create blog, by instructor user', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({
          title: 'Instructor Blog 2',
          content: 'Blog Content',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory1Id}', '$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.CREATED)
        .expectBodyContains('Instructor Blog 2')
        .stores('instructorBlog2Id', 'id')
    })

    it('should update blog', () => {
      return pactum
        .spec()
        .patch('/blogs/$S{instructorBlog1Id}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({
          title: 'Instructor Blog Updated',
          content: 'Blog Content Updated',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory3Id}'],
        })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Instructor Blog Updated')
      // .inspect()
    })
    it('should delete blog', () => {
      return pactum
        .spec()
        .delete('/blogs/{id}')
        .withPathParams('id', '$S{instructorBlog1Id}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })
    it('should get forbidden to delete a blog created by another instructor/user', () => {
      return pactum
        .spec()
        .delete('/blogs/{id}')
        .withPathParams('id', '$S{adminBlog2Id}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })
    it('should get forbidden to update a blog created by another instructor/user', () => {
      return pactum
        .spec()
        .patch('/blogs/$S{adminBlog2Id}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .withBody({
          title: 'Instructor Blog Updated 2',
          content: 'Blog Content Updated',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory3Id}'],
        })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    // it.todo('should get forbidden to publish a blog', () => {
    //   return pactum.spec().patch('/blogs/publish/$S{instructorBlog2Id}')
    // })

    it('should update blog by admin user , created by student user', () => {
      return pactum
        .spec()
        .patch('/blogs/$S{studentBlog2Id}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .withBody({
          title: 'Student Blog Updated 3',
          content: 'Blog Content Updated',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory3Id}'],
        })
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Student Blog Updated 3')
    })
    it('should delete blog by admin user , created by student user', () => {
      return pactum
        .spec()
        .delete('/blogs/{id}')
        .withPathParams('id', '$S{studentBlog2Id}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.NO_CONTENT)
    })
    it('should publish a blog (admin)', () => {
      return pactum
        .spec()
        .patch('/blogs/publish/$S{studentBlog3Id}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ isPublished: true })
    })
    it('should publish a blog (admin)', () => {
      return pactum
        .spec()
        .patch('/blogs/publish/$S{studentBlog4Id}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ isPublished: true })
    })
    it('should publish a blog (admin)', () => {
      return pactum
        .spec()
        .patch('/blogs/publish/$S{studentBlog5Id}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ isPublished: true })
    })
    it('should publish a blog (admin)', () => {
      return pactum
        .spec()
        .patch('/blogs/publish/$S{studentBlog6Id}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ isPublished: true })
    })
    it('should un-publish a blog (admin)', () => {
      return pactum
        .spec()
        .patch('/blogs/unpublish/$S{studentBlog3Id}')
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ isPublished: false })
    })

    it('should get forbidden to publish a blog (student/instructor)', () => {
      return pactum
        .spec()
        .patch('/blogs/publish/$S{studentBlog3Id}')
        .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })
    it('should get forbidden to publish a blog (student/instructor)', () => {
      return pactum
        .spec()
        .patch('/blogs/publish/$S{studentBlog3Id}')
        .withHeaders({ Authorization: 'Bearer $S{instructorAccessToken}' })
        .expectStatus(HttpStatus.FORBIDDEN)
    })

    it('should get 401 unauthorized to create blog, by unauthenticated user', () => {
      return pactum
        .spec()
        .post('/blogs')
        .withBody({
          title: 'Instructor Blog 4',
          content: 'Blog Content',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory1Id}', '$S{blogCategory2Id}'],
        })
        .expectStatus(HttpStatus.UNAUTHORIZED)
    })
    it('should get 401 unauthorized to update blog, by unauthenticated user', () => {
      return pactum
        .spec()
        .patch('/blogs/$S{studentBlog3Id}')
        .withBody({
          title: 'Student Blog 3 updated',
          content: 'Blog Content',
          featuredImage: 'image.com',
          categories: ['$S{blogCategory1Id}'],
        })
        .expectStatus(HttpStatus.UNAUTHORIZED)
    })

    it('should get 401 unauthorized to delete blog, by unauthenticated user', () => {
      return pactum
        .spec()
        .delete('/blogs/{id}')
        .withPathParams('id', '$S{studentBlog3Id}')
        .expectStatus(HttpStatus.UNAUTHORIZED)
    })
    it('should get 401 unauthorized to publish a blog, by unauthenticated user', () => {
      return pactum
        .spec()
        .patch('/blogs/publish/$S{studentBlog3Id}')
        .expectStatus(HttpStatus.UNAUTHORIZED)
    })

    it('should get all published blogs by anyone with pagination', () => {
      return pactum
        .spec()
        .get('/blogs')
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ results: [] })
        .expectJsonLike({ meta: { totalItems: 3 } })
    })
    it('should get all published blogs by anyone with pagination and search query', () => {
      return pactum
        .spec()
        .get('/blogs?search=student')
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ results: [] })
        .expectJsonLike({ meta: { totalItems: 2 } })
    })
    it('should get published blogs by anyone for specific category/ies', () => {
      return pactum
        .spec()
        .get('/blogs?category=$S{blogCategory1Id}')
        .expectStatus(HttpStatus.OK)
        .expectJsonLike({ results: [] })
        .expectJsonLike({ meta: { totalItems: 2 } })
    })
    it('should get single blog by slug, only published blog', () => {
      return pactum
        .spec()
        .get('/blogs/$S{studentBlog4Id}')
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Student Blog 4')
      // .inspect()
    })
    it('should get single blog by id, only published blog', () => {
      return pactum
        .spec()
        .get('/blogs/$S{studentBlog4Slug}')
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Student Blog 4')
      // .inspect()
    })
    it('should get all blogs (published/unpublished) by special access users with pagination', () => {
      return pactum
        .spec()
        .get('/blogs/all')
        .expectStatus(HttpStatus.OK)
        .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
        .expectJsonLike({ results: [] })
        .expectJsonLike({ meta: { totalItems: 6 } })
      // .inspect()
    })
    it('should get 404 not found for blog that is not published, public', () => {
      return pactum
        .spec()
        .get('/blogs/$S{studentBlog3Id}')
        .expectStatus(HttpStatus.NOT_FOUND)
      // .inspect()
    })

    it('should get unpublished blog by the creator and special users', () => {
      return pactum
        .spec()
        .get('/blogs/all/$S{studentBlog3Id}')
        .withHeaders('Authorization', 'Bearer $S{studentAccessToken}')
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Student Blog 3')
      // .inspect()
    })
    it('should get unpublished blog by the creator and special users', () => {
      return pactum
        .spec()
        .get('/blogs/all/$S{studentBlog3Id}')
        .withHeaders('Authorization', 'Bearer $S{adminAccessToken}')
        .expectStatus(HttpStatus.OK)
        .expectBodyContains('Student Blog 3')
      // .inspect()
    })
  })
})
