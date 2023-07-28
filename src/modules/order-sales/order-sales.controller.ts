import { Body, Controller, Post } from '@nestjs/common';
import { OrderSalesService } from './order-sales.service';
import { ApiTags } from '@nestjs/swagger';
import { OrderRejectCancelReportDto, OrderSaleReportListDto, RworkReportDto } from './order_sales.dto';

@ApiTags('Order Sale Docs')
@Controller('order-sales')
export class OrderSalesController {
  constructor(private readonly orderSalesService: OrderSalesService) {}


  @Post('reportList')
  reportList(@Body() dto: OrderSaleReportListDto) {
    return this.orderSalesService.reportList(dto);
  }

  @Post('reworkReport')
  reworkReport(
    @Body() dto: RworkReportDto,
  ) {
    return this.orderSalesService.reworkReport(dto);
  }
  @Post('orderRejectCancelReport')
  orderRejectCancelReport(
    @Body() dto: OrderRejectCancelReportDto,
  ) {
    return this.orderSalesService.orderRejectCancelReport(dto);
  }



}
