import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdatesService } from './updates.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';

@Controller('updates')
export class UpdatesController {
    constructor(private readonly updatesService: UpdatesService) { }

    @MessagePattern({ cmd: 'find_all_updates' })
    findAll(@Payload() payload: any) {
        // For now, we're not using the payload for filtering
        return this.updatesService.findAll();
    }

    @MessagePattern({ cmd: 'find_update_by_id' })
    findOne(@Payload() payload: any) {
        const { id } = payload;
        return this.updatesService.findOne(id);
    }

    @MessagePattern({ cmd: 'create_update' })
    create(@Payload() payload: any) {
        const { dto, user } = payload;
        return this.updatesService.create(dto);
    }

    @MessagePattern({ cmd: 'update_update' })
    update(@Payload() payload: any) {
        const { id, dto, user } = payload;
        return this.updatesService.update(id, dto);
    }

    @MessagePattern({ cmd: 'remove_update' })
    remove(@Payload() payload: any) {
        const { id, user } = payload;
        return this.updatesService.remove(id);
    }
}