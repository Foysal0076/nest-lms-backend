import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { UploadFileService } from './upload-file.service'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
// import path from 'path' //Doesn't work
import path = require('path')
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { generateMulterOption } from 'src/upload-file/helper'
import { Observable, of } from 'rxjs'

const maxFileSize = 1024 * 1024 * 500 // 500MB
const maxFiles = 5

const saveDestination = './uploads'
const acceptedFileFormats = [
  'jpg',
  'JPG',
  'jpeg',
  'JPEG',
  'png',
  'PNG',
  'webp',
  'WEBP',
  'gif',
  'aac',
  'mp3',
  'doc',
  'pdf',
  'html',
  'md',
  'mp4',
  'wmv',
  'avi',
]

const multerOptionForFile: MulterOptions = generateMulterOption(
  acceptedFileFormats,
  saveDestination,
  maxFileSize
)

const multerOptionForFiles: MulterOptions = generateMulterOption(
  acceptedFileFormats,
  saveDestination,
  maxFileSize,
  5
)

const avatarMulterOptions = generateMulterOption(
  ['png', 'jpg', 'jpeg', 'gif'],
  './uploads/avatar'
)

@ApiTags('File Upload')
@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @Post('upload/file')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload File' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string' },
        outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', multerOptionForFile))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: maxFileSize })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File
  ) {
    return this.uploadFileService.uploadFile(file)
  }

  @Post('upload/files')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload Files' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', maxFiles, multerOptionForFiles))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.uploadFileService.uploadFiles(files)
  }

  @Post('upload/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload Avatar' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('avatar', avatarMulterOptions))
  async uploadAvatar(
    @UploadedFile()
    file: Express.Multer.File
  ) {
    return this.uploadFileService.uploadAvatar(file)
  }

  @Get('uploads/avatar/:fileName')
  @ApiOperation({ summary: 'Fetch Avatar' })
  @ApiResponse({
    content: {
      image: {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  getAvatar(
    @Param('fileName') fileName: string,
    @Res() res
  ): Observable<object> {
    return of(res.sendFile(process.cwd() + '/uploads/avatar/' + fileName))
  }
}
