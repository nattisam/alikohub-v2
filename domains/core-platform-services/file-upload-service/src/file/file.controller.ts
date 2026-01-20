import { Controller, Post, Delete, UseInterceptors, UploadedFile, Body, Param, Query, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { Express } from 'express';
import * as Joi from 'joi';
import { JoiValidationPipe } from './joi-validation.pipe';

const uploadSchema = Joi.object({
  type: Joi.string().valid('image', 'document', 'video').default('image'),
});

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new JoiValidationPipe(uploadSchema))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File, 
    @Body('type') type: string = 'image'
  ) {
    return this.fileService.uploadFile(file, type);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return this.fileService.deleteFile(id);
  }
}
