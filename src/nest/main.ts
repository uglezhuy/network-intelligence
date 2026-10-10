import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    await app.listen(3001);

    console.log('NestJS practice API: http://localhost:3001/api/health');
    console.log('NestJS practice API: http://localhost:3001/api/scan');
}

bootstrap();