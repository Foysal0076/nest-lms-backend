import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from 'src/user/user.module'
import { UploadFileModule } from './upload-file/upload-file.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { CourseCategoryModule } from './course-category/course-category.module'
import { CourseLevelModule } from './course-level/course-level.module'
import { CourseTagModule } from './course-tag/course-tag.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    UploadFileModule,
    CourseCategoryModule,
    CourseLevelModule,
    CourseTagModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
