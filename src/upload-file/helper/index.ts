import { UnsupportedMediaTypeException } from '@nestjs/common'
import { diskStorage } from 'multer'
import path = require('path')

export const generateMulterOption = (
  acceptFileTypes: string[],
  saveDestination = './uploads',
  maxFileSize: number = 1024 * 1024 * 3,
  maxFiles = 1
) => {
  const acceptFileTypesString = acceptFileTypes.join('|')
  const acceptedFileFormats = new RegExp(`.(${acceptFileTypesString})`, 'i')

  return {
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
      fileSize: maxFileSize,
    },
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(acceptedFileFormats)) {
        return cb(
          new UnsupportedMediaTypeException(
            `Allowed file types are ${acceptFileTypesString}`
          ),
          false
        )
      }
      cb(null, true)
    },
  }
}
