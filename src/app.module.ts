import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { JwtModule } from '@nestjs/jwt';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { GlobalConfig } from 'config/global_config';

@Module({  imports: [
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'),
  }),
  JwtModule.register({
    secret: GlobalConfig().JWT_SECRET_KEY,
    signOptions: {},
  }), //jwt implement
  ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRoot(process.env.DB_GULL_URL),
  MongooseModule.forFeature([
    
    // { name: ModelNames.ROOT_CAUSES, schema: RootCausesSchema },
   
    
  ]),
  
  // SalesReturnRequestStatusesModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
