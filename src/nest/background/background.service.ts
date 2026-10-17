import { Injectable, OnModuleInit } from '@nestjs/common';
import { MonitorService } from '../monitor/monitor.service.js';
import { startActiveMonitors } from '../../monitor.js';
import { startBotTg } from '../../telegram/bot.js';

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

        void startBotTg(this.monitorService);

        console.log('Background services started');
    }
}