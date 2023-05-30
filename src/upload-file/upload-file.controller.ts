import {
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { UploadFileService } from './upload-file.service'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { diskStorage } from 'multer'
// import path from 'path' //Doesn't work
import path = require('path')
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

const acceptedFileFormats =
  /.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|gif|aac|mp3|doc|pdf|html|md|mp4|wmv|avi)/

const maxFileSize = 1024 * 1024 * 2 // 2MB
const maxFiles = 5

const saveDestination = './uploads'

export const multerOptionForFile: MulterOptions = {
  storage: diskStorage({
    destination: saveDestination,
    filename: (req, file, cb) => {
      const fileName: string =
        path.parse(file.originalname).name.replace(/\s/g, '') +
        '_' +
        new Date().getTime()
      const extension: string = path.parse(file.originalname).ext
      cb(null, `${fileName}${extension}`)
    },
  }),
  limits: {
    files: 1,
    fileSize: maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(acceptedFileFormats)) {
      return cb(
        new UnsupportedMediaTypeException(
          'Allowed file types are jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|gif|aac|mp3|doc|pdf|html|md|mp4|wmv|avi'
        ),
        false
      )
    }
    cb(null, true)
  },
}

export const multerOptionForFiles: MulterOptions = {
  storage: diskStorage({
    destination: saveDestination,
    filename: (req, file, cb) => {
      const fileName: string =
        path.parse(file.originalname).name.replace(/\s/g, '') +
        '_' +
        new Date().getTime()
      const extension: string = path.parse(file.originalname).ext
      cb(null, `${fileName}${extension}`)
    },
  }),
  limits: {
    files: maxFiles,
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(acceptedFileFormats)) {
      return cb(
        new UnsupportedMediaTypeException(
          'Allowed file types are jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|gif|aac|mp3|doc|pdf|html|md|mp4|wmv|avi'
        ),
        false
      )
    }
    cb(null, true)
  },
}

@ApiTags('File Upload')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('upload')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @Post('file')
  @ApiConsumes('multipart/form-data')
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
        .addFileTypeValidator({
          fileType: acceptedFileFormats,
        })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 2 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File
  ) {
    return this.uploadFileService.uploadFile(file)
  }

  @Post('files')
  @ApiConsumes('multipart/form-data')
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
}
