import { Module } from '@nestjs/common';
import { BackgroundService } from './background.service';
import { MonitorModule } from '../monitor/monitor.module';

@Module({
    imports: [MonitorModule],
    providers: [BackgroundService],
})
export class BackgroundModule { }