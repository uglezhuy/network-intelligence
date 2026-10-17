import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MonitorService } from './monitor/monitor.service.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    app.enableCors({
        origin: 'http://localhost:5173',
    });

    //экземпляр MonitorService из NestJS
    const monitorService = app.get(MonitorService);

    await app.listen(3001);

    console.log('NestJS API: http://localhost:3001/api/health');
}

bootstrap();