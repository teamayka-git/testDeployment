import { Module } from '@nestjs/common';
import { OrderSalesService } from './order-sales.service';
import { OrderSalesController } from './order-sales.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelNames } from 'src/common/model_names';
import { StatesSchema } from 'src/tableModels/states.model';
import { EmployeeSchema } from 'src/tableModels/employee.model';
import { DepartmentsSchema } from 'src/tableModels/departments.model';
import { ProcessMasterSchema } from 'src/tableModels/processMaster.model';
import { OrderSalesMainSchema } from 'src/tableModels/order_sales_main.model';
import { SubCategoriesSchema } from 'src/tableModels/sub_categories.model';
import { GeneralsSchema } from 'src/tableModels/generals.model';
import { ReworkReportsSchema } from 'src/tableModels/order_rework_reports.model';
import { OrderCancelRejectReportsSchema } from 'src/tableModels/order_cancel_reject_reports.model';

@Module({
  imports:[MongooseModule.forFeature([{name:ModelNames.STATES,schema:StatesSchema},
  
  
    { name: ModelNames.EMPLOYEES, schema: EmployeeSchema },
    { name: ModelNames.DEPARTMENT, schema: DepartmentsSchema },
    { name: ModelNames.PROCESS_MASTER, schema: ProcessMasterSchema },
    { name: ModelNames.ORDER_SALES_MAIN, schema:OrderSalesMainSchema },
    { name: ModelNames.SUB_CATEGORIES, schema:SubCategoriesSchema },
    { name: ModelNames.GENERALS, schema:GeneralsSchema },
    { name: ModelNames.REWORK_REPORTS, schema: ReworkReportsSchema },
    { name: ModelNames.ORDER_REJECTED_CANCEL_REPORTS, schema: OrderCancelRejectReportsSchema },
  
  ])],
  controllers: [OrderSalesController],
  providers: [OrderSalesService]
})
export class OrderSalesModule {}
