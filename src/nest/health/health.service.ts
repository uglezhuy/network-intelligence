import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
    private requestCount = 0;

    getHealth() {
        this.requestCount++;

        return {
            status: 'ok',
            service: 'Network Intelligence',
            requestCount: this.requestCount,
        };
    }
}