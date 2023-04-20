import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestValidationPipe } from './modules/helper/validationInjection';

// const ytdl = require('ytdl-core');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.useGlobalPipes(
        new NestValidationPipe({
            transform: true,
            disableErrorMessages: false,
        }),
    );


    const config = new DocumentBuilder()
        .setTitle('Share Youtube')
        .setDescription('User can share Youtube')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT);

    // ytdl.getInfo('https://www.youtube.com/watch?v=QpuISlkx1xI&t=246s').then(info => {
    // console.log(info.videoDetails);
}
bootstrap();
