import { Module } from '@nestjs/common';

import { HealthModule } from './health/health.module.js';
import { ScanModule } from './scan/scan.module.js';
import { MonitorModule } from "./monitor/monitor.module.js";
import { DashboardModule } from './dashboard/dashboard.module';
import { EventsModule } from './events/events.module';


import { PrismaModule } from './prisma/prisma.module.js';


@Module({
    imports: [HealthModule, ScanModule, PrismaModule, MonitorModule, DashboardModule, EventsModule],
})
export class AppModule { }