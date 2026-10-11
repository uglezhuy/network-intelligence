import { Module } from '@nestjs/common';

import { MonitorController } from './monitor.controller.js';
import { MonitorService } from './monitor.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
    imports: [PrismaModule],
    controllers: [MonitorController],
    providers: [MonitorService],
    exports: [MonitorService],
})
export class MonitorModule { }