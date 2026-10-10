import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ScanModule } from './scan/scan.module.js';

@Module({
    imports: [HealthModule, ScanModule],
})
export class AppModule { }