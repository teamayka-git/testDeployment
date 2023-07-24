import { Module } from '@nestjs/common';
import { TestAaaService } from './test_aaa.service';
import { TestAaaController } from './test_aaa.controller';
import { ModelNames } from 'src/common/model_names';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSchema } from 'src/tableModels/employee.model';
import { DepartmentsSchema } from 'src/tableModels/departments.model';
import { ProcessMasterSchema } from 'src/tableModels/processMaster.model';
import { OrderSalesMainSchema } from 'src/tableModels/order_sales_main.model';
import { StatesSchema } from 'src/tableModels/states.model';
import { SubCategoriesSchema } from 'src/tableModels/sub_categories.model';
import { GeneralsSchema } from 'src/tableModels/generals.model';

@Module({
  imports:[MongooseModule.forFeature([{name:ModelNames.STATES,schema:StatesSchema},
  
  
    { name: ModelNames.EMPLOYEES, schema: EmployeeSchema },
    { name: ModelNames.DEPARTMENT, schema: DepartmentsSchema },
    { name: ModelNames.PROCESS_MASTER, schema: ProcessMasterSchema },
    { name: ModelNames.ORDER_SALES_MAIN, schema:OrderSalesMainSchema },
    { name: ModelNames.SUB_CATEGORIES, schema:SubCategoriesSchema },
    { name: ModelNames.GENERALS, schema:GeneralsSchema },
  
  ])],
  controllers: [TestAaaController],
  providers: [TestAaaService]
})
export class TestAaaModule {}
