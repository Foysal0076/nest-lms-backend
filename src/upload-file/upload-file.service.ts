import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ImageUrl,
  UploadFileResponse,
  UploadFilesResponse,
} from 'src/upload-file/dto'

@Injectable()
export class UploadFileService {
  constructor(private configService: ConfigService) {}

  uploadFile(file: Express.Multer.File): UploadFileResponse {
    const domainUrl = this.configService.get('DOMAIN_URL')
    const fileUrl = `${domainUrl}/uploads/${file.filename}`
    return new UploadFileResponse(fileUrl)
  }

  uploadFiles(files: Express.Multer.File[]): UploadFilesResponse {
    const domainUrl = this.configService.get('DOMAIN_URL')
    const fileUrls = files.map(
      (file) =>
        new ImageUrl(file.filename, `${domainUrl}/uploads/${file.filename}`)
    )
    return new UploadFilesResponse(fileUrls)
  }

  uploadAvatar(file: Express.Multer.File): UploadFileResponse {
    const domainUrl = this.configService.get('DOMAIN_URL')
    const fileUrl = `${domainUrl}/uploads/avatar/${file.filename}`
    return new UploadFileResponse(fileUrl)
  }
}
