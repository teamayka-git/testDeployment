import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ClusterService } from './cluster.service';

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
SwaggerModule.setup("swagger_docss", app, doc, {
  swaggerOptions: {
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
});
// /*
app.use(cookieParser()); //jwt read from cookie
app.enableCors({
  origin: '*',
  credentials: true, //jwt response store in cookie
});

console.log('satarted----------------');
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true, // if in body unwanted items then no need to throw bad request
    forbidNonWhitelisted: true,
  }),
);
// */


  await app.listen(process.env.PORT || 3000);
}
bootstrap();
// ClusterService.clusterize(bootstrap);
  