import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { ConTechProfileModule } from './contech-profile/contech-profile.module';
import { RouterModule } from '@nestjs/core';
import { ContechController } from './contech-service.controller';
import { ContractModule } from './contract/contract.module';
import { InspectionModule } from './inspection/inspection.module';
import { ClientReportModule } from './client-report/client-report.module';
import { MilestonesModule } from './milestones/milestones.module';

@Module({
    imports: [
        ConTechProfileModule,
        ProjectsModule,
        TasksModule,
        ContractModule,
        InspectionModule,
        ClientReportModule,
        MilestonesModule,
    ],
    controllers: [ContechController]
})
export class ConTechServiceModule { }