// src/contracts/contracts.controller.ts (in Microservice)
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ContractService } from './contract.service';
import { UpdateContractStatusDto } from './dto/update-contract-status.dto';
import { AddChangeOrderDto } from './dto/add-change-order.dto';

@Controller()
export class ContractController {
  constructor(private readonly contractsService: ContractService) { }

  @MessagePattern({ cmd: 'uploadContract' })
  uploadContract(@Payload() payload: { projectId: number; file: any }) {
    // Deserialize buffer before passing to service
    const fileBuffer = Buffer.from(payload.file.buffer, 'base64');
    return this.contractsService.uploadAndCreateContract(
      payload.projectId,
      fileBuffer,
      payload.file.originalname,
    );
  }

  @MessagePattern({ cmd: 'updateContractStatus' })
  updateStatus(@Payload() payload: { id: number } & UpdateContractStatusDto) {
    return this.contractsService.updateStatus(payload.id, payload.status);
  }

  @MessagePattern({ cmd: 'addChangeOrder' })
  addChangeOrder(@Payload() payload: { id: number } & AddChangeOrderDto) {
    const { id, ...changeOrderData } = payload;
    return this.contractsService.addChangeOrder(id, changeOrderData);
  }

  @MessagePattern({ cmd: 'getContractViewUrl' })
  getSecureViewUrl(@Payload() payload: { id: number }) {
    return this.contractsService.generateSignedUrl(payload.id);
  }

  @MessagePattern({ cmd: 'getContractsByProjectId' })
  getContractsByProjectId(@Payload() payload: { projectId: number }) {
    return this.contractsService.findByProjectId(payload.projectId);
  }
}