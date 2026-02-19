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
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { UploadContentDto, ContentType } from './dto/upload-content.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileUploadService } from '../../file-upload-service/file-upload.service';

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
  constructor(
    @Inject('ACADEMY_SERVICE') private academyClient: ClientProxy,
    private readonly fileUploadService: FileUploadService
  ) { }

  @Post()
  createContent(@Request() req: RequestWithUser, @Body() createContentDto: CreateContentDto) {
    const payload = {
      dto: {
        ...createContentDto,
        lessonId: Number(createContentDto.lessonId),
      },
      user: req.user,
    };
    return this.academyClient.send({ cmd: 'create_content' }, payload);
  }

  // NEW: Upload file content
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload content file',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        lessonId: { type: 'number' },
        title: { type: 'string' },
        type: { type: 'string', enum: ['VIDEO', 'PDF', 'QUIZ', 'ASSIGNMENT'] },
      },
      required: ['file', 'lessonId'],
    },
  })
  async uploadContent(
    @Request() req: RequestWithUser,
    @Body() uploadContentDto: UploadContentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      console.log(`[DEBUG] Received Upload Request:`, {
        title: uploadContentDto.title,
        type: uploadContentDto.type,
        lessonId: uploadContentDto.lessonId,
        lessonIdType: typeof uploadContentDto.lessonId,
        file: file ? { originalname: file.originalname, size: file.size, mimetype: file.mimetype } : 'MISSING'
      });

      if (!file) {
        throw new BadRequestException('File is required');
      }

      const lessonId = Number(uploadContentDto.lessonId);
      if (isNaN(lessonId)) {
        throw new BadRequestException(`Invalid lessonId: ${uploadContentDto.lessonId}. Must be a number.`);
      }

      // Map content type to file service category
      let uploadType: 'image' | 'video' | 'document' = 'document';
      if (uploadContentDto.type === ContentType.VIDEO) {
        uploadType = 'video';
      }

      const uploadResult = await this.fileUploadService.uploadFile(file, uploadType);
      console.log(`[DEBUG] File upload successful:`, uploadResult);

      const payload = {
        dto: {
          title: uploadContentDto.title,
          type: uploadContentDto.type,
          lessonId: lessonId,
          description: uploadContentDto.description,
          contentUrl: uploadResult.url,
        },
        user: req.user,
      };
      
      console.log(`[DEBUG] Sending to Academy microservice:`, JSON.stringify(payload, null, 2));
      
      // Use firstValueFrom to wait for microservice response and catch potential errors
      const result = await firstValueFrom(this.academyClient.send({ cmd: 'upload_content_file' }, payload));
      console.log(`[DEBUG] Academy microservice response:`, result);
      return result;
    } catch (error: any) {
      console.error(`[ERROR] uploadContent failed:`, error);
      if (error.response) {
        console.error(`[ERROR] Response data:`, error.response.data);
      }
      throw error;
    }
  }

  @Get('lesson/:lessonId')
  findContentByLesson(
    @Request() req: RequestWithUser, 
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Query() query: any
  ) {
    const payload = {
      lessonId: Number(lessonId),
      user: req.user,
      query,
    };
    return this.academyClient.send({ cmd: 'find_content_by_lesson' }, payload);
  }

  @Get('instructor/my')
  getMyContent(@Request() req: RequestWithUser, @Query() query: any) {
    return this.academyClient.send({ cmd: 'find_instructor_content' }, { user: req.user, query });
  }

  @Get()
  findAllContent(@Request() req: RequestWithUser, @Query() query: any) {
    const payload = { user: req.user, query };
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