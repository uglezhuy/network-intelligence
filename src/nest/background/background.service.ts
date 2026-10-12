import { Injectable, OnModuleInit } from '@nestjs/common';
import { MonitorService } from '../monitor/monitor.service.js';
import { startActiveMonitors } from '../../monitor.js';

@Injectable()
export class BackgroundService implements OnModuleInit {
    constructor(
        private readonly monitorService: MonitorService,
    ) { }

    async onModuleInit() {
        console.log('Starting background services...');

        const activeMonitors =
            await this.monitorService.getActiveMonitors();

        startActiveMonitors(activeMonitors);

        console.log('Background services started');
    }
}