import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })) // This will strip any fields in the request body that are not defined in the dto(data transfer object)

  //Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest LMS Backend')
    .setDescription('Learning Management System project apis')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)

  SwaggerModule.setup('api', app, document)

  await app.listen(5001)
}
bootstrap()
