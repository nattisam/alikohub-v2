import { Module } from "@nestjs/common";
import { ClientReportController } from "./client-report.controller";

@Module({
    controllers: [ClientReportController]
})
export class ClientReportModule {}