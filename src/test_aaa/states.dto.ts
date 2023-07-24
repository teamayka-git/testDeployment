import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNumber,
  isNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, Type as ValidateTypes } from 'class-transformer';
import { Optional } from '@nestjs/common';

const descriptionStatus = '0-Inactive, 1-Active, 2-Delete';
const descriptionListScreenTypeForList = '0-total documents count';
const descriptionListDataGuard =
  '0-edit protect, 1-disabe protect, 2-delete protect';
const descriptionListSortOrder = '1-ascending, -1-descending';
const descriptionWorkStatus = '0-pending, 1-accepted, 2-rejected';
const descriptionListSortType = '0-Created Date, 1-Status,2-Name, 3-Code';const descriptionListScreenTypeOrderSaleReport =
'0-total documents count, 100 - process masters extra, 101-list documents, 102-shop id, 103-root cause populate, 104-order sale histories, 105-set process, 107-workers list extra, 108 - set process under[105] process master, 109 - set process under[105] user, 110 - set process under[105] set sub process,111 - set process under[105] sub process under[110] sub process master,112 - set process under[105] sub process under[110] user populate,113 - set process under[105] sub process under[110] user under global gallery, 114 - order sale history under[104] user details, 115 - order sale history under[104] user details under[114] global gallery, 116 - order sale history under[104] created user details ,117 - order sale history under[104] created user details under[116] global gallery, 118- order sale document under[101] global galleryu populate, 119 - shop under[102] global gallery details, 120 -  order head details, 121 - order head under[120] global gallery, 122 - shop under[102] relationship manager details,123 - shop under[102] relationship manager under[122] global gallery , 124 - order sale list sales order items ,125 - order sale items list under[124] product details,126 - order sale items list under[124] design details, 127 -  order sale items list under[124] sub category, 128 -  order sale items list under[124] sub category under[127] category details, 129 -  order sale items list under[124] sub category under[127] category under[128] group details, 130 - shop under[102] branch details, 131 - order sale items list under[124] invoice items, 132 - order sale items list under[124] invoice items under[131] invoice details, , 133 -order sale histories under[104] delivery provider details, 134 -shop under[102] city details    500 - sub categori list extra, 501 - general settings due date days count extra';
const descriptionType =
  ' 0 - order sale(custom order), 1 - stock sale(from e store), 2 - sales on approval(from delivery boy), 3 - counter sale(bill from manufactor) ';


  const descriptionSetProcessOrderStatus =
  'inside ordersale list set process filter with this array if this arrayu not empty';


  
class StatesCreateList {
  @IsString()
  @ApiProperty({})
  name: string;

  @IsNumber()
  @ApiProperty({})
  code: number;

  @IsArray()
  @ApiProperty({ type: [Number], description: descriptionListDataGuard })
  dataGuard: number[];
}

export class StatesCreateDto {
  @IsArray()
  @ApiProperty({ type: [StatesCreateList] })
  @ValidateNested({ each: true })
  @Type(() => StatesCreateList)
  array: StatesCreateList[];
}
export class StatesEditDto {
  @IsString()
  @ApiProperty({})
  stateId: string;
  @IsString()
  @ApiProperty({})
  name: string;

  @IsNumber()
  @ApiProperty({})
  code: number;

  @IsArray()
  @ApiProperty({ type: [Number], description: descriptionListDataGuard })
  dataGuard: number[];
}

export class StatesListDto {
  @IsNumber()
  @ApiProperty({ description: descriptionListSortType })
  sortType: number;
  @IsNumber()
  @ApiProperty({ description: descriptionListSortOrder })
  sortOrder: number;

  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({ type: [Number], description: descriptionStatus })
  statusArray: number[];

  @IsArray()
  @ApiProperty({
    type: [Number],
    description: descriptionListScreenTypeForList,
  })
  screenType: number[];


  @IsArray()
  @ApiProperty({ type: [Number], })
  responseFormat: number[];
  
  @IsArray()
  @ApiProperty({ type: [String] })
  stateIds: string[];

  @IsNumber()
  @ApiProperty({})
  limit: number;

  @IsNumber()
  @ApiProperty({})
  skip: number;

  @IsString()
  @ApiProperty({})
  searchingText: string;
}

export class StatesStatusChangeDto {
  @IsArray()
  @ApiProperty({ type: [String] })
  stateIds: string[];

  @IsNumber()
  @ApiProperty({ description: descriptionStatus })
  status: number;
}
export class CheckItemExistDto {
  @IsString()
  @ApiProperty({})
  value: string;

  @IsArray()
  @ApiProperty({ type: [String] })
  existingIds: string[];
}
export class CheckNameExistDto {
  @IsString()
  @ApiProperty({})
  value: string;

  @IsArray()
  @ApiProperty({ type: [String] })
  existingIds: string[];
}






export class OrderSaleReportListDto {
  @IsNumber()
  @ApiProperty({ description: descriptionListSortType })
  sortType: number;

  @IsNumber()
  @ApiProperty({ description: descriptionListSortOrder })
  sortOrder: number;

  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({ type: [Number], description: descriptionStatus })
  statusArray: number[];

  @IsArray()
  @ApiProperty({
    type: [Number],
    description: descriptionListScreenTypeOrderSaleReport,
  })
  screenType: number[];

  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({ type: [Number] })
  responseFormat: number[];

  @IsArray()
  @ApiProperty({ type: [Number] })
  isProductGenerated: number[];

  @IsArray()
  @ApiProperty({ type: [Number] })
  isInvoiceGenerated: number[];

  @IsNumber()
  @ApiProperty({})
  limit: number;

  @IsNumber()
  @ApiProperty({})
  skip: number;
  //

  @IsNumber()
  @ApiProperty({})
  netWeightStart: number;

  @IsNumber()
  @ApiProperty({})
  productCreatedStartDate: number;

  @IsNumber()
  @ApiProperty({})
  productCreatedEndDate: number;

  @IsNumber()
  @ApiProperty({})
  deliveryAssignedStartDate: number;

  @IsNumber()
  @ApiProperty({})
  deliveryAssignedEndDate: number;

  @IsArray()
  @ApiProperty({ type: [String] })
  orderSaleIds: string[];

  @IsNumber()
  @ApiProperty({})
  deliveryCompleteStartDate: number;

  @IsNumber()
  @ApiProperty({})
  deliveryCompleteEndDate: number;

  @IsArray()
  @ApiProperty({ type: [Number] })
  deliveryStatus: number[];

  @IsNumber()
  @ApiProperty({})
  agingStartCount: number;

  @IsNumber()
  @ApiProperty({})
  agingEndCount: number;

  @IsNumber()
  @ApiProperty({})
  netWeightEnd: number;

  @IsArray()
  @ApiProperty({ type: [String] })
  huids: string[];

  @IsArray()
  @ApiProperty({ type: [String] })
  deliveryExecutiveIds: string[];

  @IsArray()
  @ApiProperty({ type: [String] })
  logisticsPartnerIds: string[];

  @IsArray()
  @ApiProperty({ type: [String] })
  orderSaleUids: string[];

  @IsArray()
  @ApiProperty({ type: [String] })
  subCategoryIds: string[];

  @IsNumber()
  @ApiProperty({})
  dueStartDate: number;

  @IsNumber()
  @ApiProperty({})
  dueEndDate: number;

  @IsArray()
  @ApiProperty({ type: [String] })
  orderHeadIds: string[];

  @IsArray()
  @ApiProperty({ type: [String] })
  shopIds: string[];

  @IsArray()
  @ApiProperty({ type: [Number], description: descriptionWorkStatus })
  workStatus: number[];

  @IsArray()
  @ApiProperty({ type: [String] })
  referenceIds: string[];

  @IsArray()
  @ApiProperty({ type: [Number], description: descriptionType })
  types: number[];

  @IsNumber()
  @ApiProperty({})
  createdDateStartDate: number;

  @IsNumber()
  @ApiProperty({})
  createdDateEndDate: number;

  @IsArray()
  @ApiProperty({ type: [String] })
  cityIds: string[];

  @IsArray()
  @ApiProperty({ type: [String] })
  branchIds: string[];

  @IsArray()
  @ApiProperty({ type: [String] })
  relationshipManagerIds: string[];

  @IsNumber()
  @ApiProperty({})
  invoiceDateStartDate: number;

  @IsNumber()
  @ApiProperty({})
  invoiceDateEndDate: number;

  @IsArray()
  @ApiProperty({ type: [String] })
  invoiceUids: string[];

  @IsArray()
  @ApiProperty({ type: [String] })
  orderProcessMasterIds: string[];

  @IsArray()
  @ApiProperty({ type: [String] })
  orderSetProcessWorkerIds: string[];

  @IsArray()
  @ApiProperty({ type: [Number] })
  orderSetProcessOrderStatus: number[];

  @IsNumber()
  @ApiProperty({})
  processAssignStartDate: number;

  @IsNumber()
  @ApiProperty({})
  processAssignEndDate: number;

  @IsNumber()
  @ApiProperty({})
  processWorkCompletedStartDate: number;

  @IsNumber()
  @ApiProperty({})
  processWorkCompletedEndDate: number;

  @IsNumber()
  @ApiProperty({})
  processWorkStartDate: number;

  @IsNumber()
  @ApiProperty({})
  processWorkEndDate: number;

  @IsArray()
  @ApiProperty({
    type: [Number],
    description: descriptionSetProcessOrderStatus,
  })
  setProcessOrderStatus: number[];
}
