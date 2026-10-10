import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
    private readonly healthService: HealthService;

    constructor(healthService: HealthService) {
        this.healthService = healthService;
    }
    @Get()



    getHealth() {
        return this.healthService.getHealth();
    }


}





