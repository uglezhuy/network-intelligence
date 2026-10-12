import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    app.enableCors({
        origin: 'http://localhost:5173',
    });

    await app.listen(3001);

    console.log('NestJS API: http://localhost:3001/api/health');
}

bootstrap();