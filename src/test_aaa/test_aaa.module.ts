import { Module } from '@nestjs/common';
import { TestAaaService } from './test_aaa.service';
import { TestAaaController } from './test_aaa.controller';
import { ModelNames } from 'src/common/model_names';
import { StatesSchema } from 'src/table_models/states.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{name:ModelNames.STATES,schema:StatesSchema}])],
  controllers: [TestAaaController],
  providers: [TestAaaService]
})
export class TestAaaModule {}
