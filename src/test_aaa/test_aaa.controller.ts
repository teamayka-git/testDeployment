import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestAaaService } from './test_aaa.service';
import { ApiTags } from '@nestjs/swagger';
import { StatesListDto } from './states.dto';


@ApiTags("State Docs") 
@Controller('test-aaa')
export class TestAaaController {
  constructor(private readonly testAaaService: TestAaaService) {}

  @Post("list")
  list(@Body() dto:StatesListDto) {
    return this.testAaaService.list(dto);
  }
}
