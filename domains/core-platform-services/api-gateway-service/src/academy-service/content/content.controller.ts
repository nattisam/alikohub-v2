import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { UploadContentDto, ContentType } from './dto/upload-content.dto';
import { FileInterceptor } from '@nestjs/platform-express';

// Define the file type interface
interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Controller('academy/content')
@UseGuards(AuthGuard)
export class ContentController {
  constructor(@Inject('ACADEMY_SERVICE') private academyClient: ClientProxy) { }

  @Post()
  createContent(@Request() req: RequestWithUser, @Body() createContentDto: CreateContentDto) {
    const payload = {
      dto: createContentDto,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'create_content' }, payload);
  }

  // NEW: Upload file content
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadContent(
    @Request() req: RequestWithUser,
    @Body() uploadContentDto: UploadContentDto,
    @UploadedFile() file: any,
  ) {
    // Convert the file to a serializable format
    const serializableFile = {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    const payload = {
      dto: uploadContentDto,
      file: serializableFile,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'upload_content_file' }, payload);
  }

  @Get('lesson/:lessonId')
  findContentByLesson(@Request() req: RequestWithUser, @Param('lessonId', ParseIntPipe) lessonId: number) {
    const payload = {
      lessonId,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'find_content_by_lesson' }, payload);
  }

  @Get()
  findAllContent(@Request() req: RequestWithUser) {
    const payload = { user: req.user };
    return this.academyClient.send({ cmd: 'find_all_content' }, payload);
  }

  @Get(':id')
  findContentById(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = { id, user: req.user };
    return this.academyClient.send({ cmd: 'find_content_by_id' }, payload);
  }

  @Patch(':id')
  updateContent(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number, @Body() updateContentDto: UpdateContentDto) {
    const payload = {
      id,
      dto: updateContentDto,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'update_content' }, payload);
  }

  @Delete(':id')
  removeContent(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = {
      id,
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'remove_content' }, payload);
  }
}