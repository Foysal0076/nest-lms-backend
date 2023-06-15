import { HttpStatus } from '@nestjs/common'

export class UploadFileResponse {
  private readonly statusCode: number = HttpStatus.OK
  url: string
  private readonly message = 'File uploaded successfully'

  constructor(url: string) {
    this.url = url
  }
}
