import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContractService } from './contract.service';
import { UpdateContractStatusDto } from './dto/update-contract-status.dto';
import { AddChangeOrderDto } from './dto/add-change-order.dto';
import { AuthenticatedUser } from '../user/user.service';
import { ConTechProfileGuard, RoleGuard, Roles } from '../auth';

@Controller()
@UseGuards(ConTechProfileGuard)
export class ContractController {
  constructor(private readonly contractsService: ContractService) { }

  @MessagePattern({ cmd: 'uploadContract' })
  @UseGuards(RoleGuard)
  @Roles('PROJECT_MANAGER', 'ADMIN')
  uploadContract(@Payload() payload: { projectId: number; file: any; user: AuthenticatedUser }) {
    // Deserialize buffer before passing to service
    const fileBuffer = Buffer.from(payload.file.buffer, 'base64');
    return this.contractsService.uploadAndCreateContract(
      payload.projectId,
      fileBuffer,
      payload.file.originalname,
    );
  }

  @MessagePattern({ cmd: 'updateContractStatus' })
  @UseGuards(RoleGuard)
  @Roles('PROJECT_MANAGER', 'ADMIN', 'CLIENT')
  updateStatus(@Payload() payload: { id: number; user: AuthenticatedUser } & UpdateContractStatusDto) {
    return this.contractsService.updateStatus(payload.id, payload.status);
  }

  @MessagePattern({ cmd: 'addChangeOrder' })
  @UseGuards(RoleGuard)
  @Roles('PROJECT_MANAGER', 'ADMIN')
  addChangeOrder(@Payload() payload: { id: number; addChangeOrderDto: AddChangeOrderDto; user: AuthenticatedUser }) {
    return this.contractsService.addChangeOrder(payload.id, payload.addChangeOrderDto);
  }

  @MessagePattern({ cmd: 'getContractViewUrl' })
  getSecureViewUrl(@Payload() payload: { id: number; user: AuthenticatedUser }) {
    return this.contractsService.generateSignedUrl(payload.id);
  }

  @MessagePattern({ cmd: 'getContractsByProjectId' })
  getContractsByProjectId(@Payload() payload: { projectId: number; user: AuthenticatedUser }) {
    return this.contractsService.findByProjectId(payload.projectId);
  }
}