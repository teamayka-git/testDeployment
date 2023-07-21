import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // await app.listen(8080);



  const swaggerConfig = new DocumentBuilder()
  .setTitle('Swagger API Documentation')
  .setDescription(
    "here explaining common structure of API,[priority->It will be integer. it will sort that items, searchingText->It is string for search key, skip->This is pagination offset, limit->This is for pagination Limit, screenType->it's for optional datas]",
  )
  .setVersion('1.0')
  .build();
const doc = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup("swagger_doc", app, doc, {
  swaggerOptions: {
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
});





  await app.listen(process.env.PORT || 3000);
}
bootstrap();
  