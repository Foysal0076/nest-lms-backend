import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/prisma/prisma.service'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { ADMIN_DATA, INSTRUCTOR_DATA, STUDENT_DATA } from 'src/utils/constants'

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

  it('should create a blog', () => {
    return pactum
      .spec()
      .post('/blogs')
      .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
      .withBody({
        title: 'Admin Blog 1',
        content: 'Blog Content',
        featuredImage: 'image.com',
        categories: ['$S{blogCategory1Id}'],
      })
      .expectStatus(HttpStatus.CREATED)
      .expectBodyContains('Admin Blog 1')
      .stores('adminBlog1Id', 'id')
  })

  //Admin
  it('should create a blog comment', () => {
    return pactum
      .spec()
      .post('/blog-comments')
      .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
      .withBody({
        content: 'Blog Comment Content by admin user',
        blogId: '$S{adminBlog1Id}',
      })
      .expectStatus(HttpStatus.CREATED)
      .expectBodyContains('Blog Comment Content by admin user')
      .stores('adminBlogComment1Id', 'id')
  })

  it('should create a blog comment', () => {
    return pactum
      .spec()
      .post('/blog-comments')
      .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
      .withBody({
        content: 'Blog Comment Content by admin user 2',
        blogId: '$S{adminBlog1Id}',
      })
      .expectStatus(HttpStatus.CREATED)
      .expectBodyContains('Blog Comment Content by admin user 2')
      .stores('adminBlogComment2Id', 'id')
    // .inspect()
  })

  it('should block any comment', () => {
    return pactum
      .spec()
      .patch('/blog-comments/block/$S{adminBlogComment1Id}')
      .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
      .expectJsonLike({ isBlocked: true })
      .expectStatus(HttpStatus.OK)
  })

  it('should unblock any comment', () => {
    return pactum
      .spec()
      .patch('/blog-comments/unblock/$S{adminBlogComment1Id}')
      .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
      .expectStatus(HttpStatus.OK)
      .expectJsonLike({ isBlocked: false })
  })

  it('should update a comment', () => {
    return pactum
      .spec()
      .patch('/blog-comments/$S{adminBlogComment2Id}')
      .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
      .withBody({
        content: 'Blog Comment Content updated',
      })
      .expectStatus(HttpStatus.OK)
      .expectBodyContains('Blog Comment Content updated')
  })

  it('should delete a comment', () => {
    return pactum
      .spec()
      .delete('/blog-comments/$S{adminBlogComment1Id}')
      .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
      .expectStatus(HttpStatus.NO_CONTENT)
  })

  //Student
  it('should create a blog comment', () => {
    return pactum
      .spec()
      .post('/blog-comments')
      .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
      .withBody({
        content: 'Blog Comment Content by Student user',
        blogId: '$S{adminBlog1Id}',
      })
      .expectStatus(HttpStatus.CREATED)
      .expectBodyContains('Blog Comment Content by Student user')
      .stores('studentBlogComment1Id', 'id')
      .inspect()
  })
  it('should create a blog comment', () => {
    return pactum
      .spec()
      .post('/blog-comments')
      .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
      .withBody({
        content: 'Blog Comment Content by Student user 2',
        blogId: '$S{adminBlog1Id}',
      })
      .expectStatus(HttpStatus.CREATED)
      .expectBodyContains('Blog Comment Content by Student user 2')
      .stores('studentBlogComment2Id', 'id')
    // .inspect()
  })
  it('should create a blog comment', () => {
    return pactum
      .spec()
      .post('/blog-comments')
      .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
      .withBody({
        content: 'Blog Comment Content by student user 3',
        blogId: '$S{adminBlog1Id}',
      })
      .expectStatus(HttpStatus.CREATED)
      .expectBodyContains('Blog Comment Content by student user 3')
      .stores('adminBlogComment3Id', 'id')
    // .inspect()
  })
  it('should update a comment', () => {
    return pactum
      .spec()
      .patch('/blog-comments/$S{studentBlogComment2Id}')
      .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
      .withBody({
        content: 'Content Updated',
      })
      .expectStatus(HttpStatus.OK)
      .expectBodyContains('Content Updated')
    // .inspect()
  })
  it('should delete a comment', () => {
    return pactum
      .spec()
      .delete('/blog-comments/$S{studentBlogComment1Id}')
      .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
      .expectStatus(HttpStatus.NO_CONTENT)
  })
  it('should get Forbidden to delete a comment created by other user', () => {
    return pactum
      .spec()
      .delete('/blog-comments/$S{adminBlogComment2Id}')
      .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
      .expectStatus(HttpStatus.FORBIDDEN)
  })
  it('should get Forbidden error when blocking a comment', () => {
    return pactum
      .spec()
      .patch('/blog-comments/block/$S{adminBlogComment2Id}')
      .withHeaders({ Authorization: 'Bearer $S{studentAccessToken}' })
      .expectStatus(HttpStatus.FORBIDDEN)
  })

  //Admin
  it('should update a comment created by any user', () => {
    return pactum
      .spec()
      .patch('/blog-comments/$S{studentBlogComment2Id}')
      .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
      .withBody({
        content: 'Content Updated',
      })
      .expectStatus(HttpStatus.OK)
      .expectBodyContains('Content Updated')
  })
  it('should delete a comment created by any user', () => {
    return pactum
      .spec()
      .delete('/blog-comments/$S{studentBlogComment2Id}')
      .withHeaders({ Authorization: 'Bearer $S{adminAccessToken}' })
      .expectStatus(HttpStatus.NO_CONTENT)
  })
})
