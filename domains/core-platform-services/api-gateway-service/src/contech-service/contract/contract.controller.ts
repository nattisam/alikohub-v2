import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../../common/guard/firebase_auth.guard';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { lastValueFrom } from 'rxjs';
import { UpdateContractStatusDto } from './dto/update-contract-status.dto';
import { AddChangeOrderDto } from './dto/add-change-order.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('Contracts')
@ApiBearerAuth()
@Controller('contracts')
@UseGuards(AuthGuard)
export class ContractController {
  constructor(@Inject('CONTECH_SERVICE') private contechClient: ClientProxy) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('contractFile'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a contract file for a project' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        projectId: { type: 'number' },
        contractFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Contract uploaded successfully' })
  uploadContract(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body('projectId', ParseIntPipe) projectId: number,
  ) {
    // Serialize file as base64 for microservice transport
    const serializedFile = {
      buffer: file.buffer.toString('base64'),
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    const payload = {
      user: req.user,
      projectId,
      file: serializedFile,
    };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'uploadContract' }, payload),
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update the status of a contract' })
  @ApiParam({ name: 'id', description: 'Contract ID', type: Number })
  @ApiBody({ type: UpdateContractStatusDto })
  updateStatus(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContractStatusDto: UpdateContractStatusDto,
  ) {
    const payload = {
      user: req.user,
      id,
      ...updateContractStatusDto,
    };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'updateContractStatus' }, payload),
    );
  }

  @Post(':id/change-orders')
  @ApiOperation({ summary: 'Add a change order to a contract' })
  @ApiParam({ name: 'id', description: 'Contract ID', type: Number })
  @ApiBody({ type: AddChangeOrderDto })
  addChangeOrder(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() addChangeOrderDto: AddChangeOrderDto,
  ) {
    const payload = {
      user: req.user,
      id,
      addChangeOrderDto,
    };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'addChangeOrder' }, payload),
    );
  }

  @Get(':id/view')
  @ApiOperation({ summary: 'Get secure view URL for a contract' })
  @ApiParam({ name: 'id', description: 'Contract ID', type: Number })
  getSecureViewUrl(@Request() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const payload = {
      user: req.user,
      id,
    };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'getContractViewUrl' }, payload),
    );
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all contracts for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID', type: Number })
  getContractsByProjectId(
    @Request() req: RequestWithUser,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    const payload = {
      user: req.user,
      projectId,
    };
    return lastValueFrom(
      this.contechClient.send({ cmd: 'getContractsByProjectId' }, payload),
    );
  }
}
