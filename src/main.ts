import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // if (process.env.NODE_ENV !== 'local') {
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    // }
    app.use(helmet());
    app.enableCors();
    app.enableShutdownHooks();

    const config = new DocumentBuilder()
        .setTitle('REST example')
        .setDescription('The REST API description')
        .setVersion('1.0')
        .addTag('REST')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}

bootstrap();
