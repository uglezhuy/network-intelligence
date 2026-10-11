import { Module } from '@nestjs/common';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MonitorModule } from '../monitor/monitor.module.js';

@Module({
    imports: [PrismaModule, MonitorModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }