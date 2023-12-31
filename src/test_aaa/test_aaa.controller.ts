import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestAaaService } from './test_aaa.service';
import { ApiTags } from '@nestjs/swagger';
import { OrderSaleReportListDto, StatesListDto } from './states.dto';


@ApiTags("Common Docs") 
@Controller('test-aaa')
export class TestAaaController {
  constructor(private readonly testAaaService: TestAaaService) {}

  @Post("stateList")
  stateList(@Body() dto:StatesListDto) {
    return this.testAaaService.stateList(dto);
  }
  @Post('orderReportList')
  reportList(@Body() dto: OrderSaleReportListDto) {
    return this.testAaaService.orderReportList(dto);
  }
}
