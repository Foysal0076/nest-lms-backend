import { HttpStatus } from '@nestjs/common'
import { ImageUrl } from 'src/upload-file/dto/image-url.dto'

export class UploadFilesResponse {
  private readonly statusCode: number = HttpStatus.OK
  urls: ImageUrl[]
  private readonly message = 'Files uploaded successfully'

  constructor(urls: ImageUrl[]) {
    this.urls = urls
  }
}
