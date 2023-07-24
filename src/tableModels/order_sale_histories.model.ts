import { SsmTargetAccount } from 'aws-sdk/clients/ssmincidents';
import * as mongoose from 'mongoose';
import { ModelNames } from 'src/common/model_names';
import { GlobalConfig } from 'src/config/global_config';

export const OrderSaleHistoriesSchema = new mongoose.Schema({
  //  _id: mongoose.Schema.Types.ObjectId,

  _orderSaleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.ORDER_SALES_MAIN,
    default: null,
  },
  _orderSaleItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.ORDER_SALES_ITEMS,
    default: null,
  },
  _deliveryProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.DELIVERY_PROVIDER,
    default: null,
  },
  _deliveryCounterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.DELIVERY_COUNTERS,
    default: null,
  },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.USER,
    default: null,
  },
  _shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.SHOPS,
    default: null,
  },
  _type: { type: Number, required: true, default: -1 },
  _description: { type: String, default: 'nil' },
  _createdUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.USER,
    default: null,
  },
  _createdAt: { type: Number, required: true, default: -1 },
  _status: { type: Number, required: true, default: -1 },
});

export interface OrderSaleHistories {
  _id: String;
  _orderSaleId: String;
  _orderSaleItemId: String;
  _deliveryProviderId: String;
  _deliveryCounterId: String;
  _shopId: string;
  _userId: String;
  _type: number;
  _description: String;
  _createdUserId: string;
  _createdAt: number;
  _status: Number;
}

OrderSaleHistoriesSchema.index({ _deliveryCounterId: 1 });
OrderSaleHistoriesSchema.index({ _deliveryProviderId: 1 });
OrderSaleHistoriesSchema.index({ _shopId: 1 });
OrderSaleHistoriesSchema.index({ _orderSaleId: 1 });
OrderSaleHistoriesSchema.index({ _orderSaleItemId: 1 });
OrderSaleHistoriesSchema.index({ _userId: 1 });
OrderSaleHistoriesSchema.index({ _description: 1 });
OrderSaleHistoriesSchema.index({ _type: 1 });
OrderSaleHistoriesSchema.index({ _createdUserId: 1 });
OrderSaleHistoriesSchema.index({ _createdAt: 1 });
OrderSaleHistoriesSchema.index({ _status: 1 });

/*
_type:{
  0 - order pending
  1 - order accept
  2 - order reject
  3 - set process done
  4 - finished goods
  5 - product generate request
  6 - product generated 
  7 - deliverychalan generated//need to discuss
  8 - halmark issuence requested
  9 - halmark issuence bypassed
  10 - send to halmark issuence
  11 - halmarking issued
  12 - halmark request cancelled
  13 - halmark request rejected
  14 - halmark error occured
  15 - send to reissuence 
  16 - invoice pending
  17 - invoice generated
  18 - outof delivery pending
  20 - delivery job assigned
  21 - delivery in transit        
  24 - order declined collection pending 
  25 - order declined collected
  26 - order declined inscan
  27 - order cancelled 
  28 - delivery reshedule requested
  29 - hub tranfer pending
  30 - hub assigned
  31 - hub tranfer intransit
  32 - hub transfer delivered
  33 - hub transfer accepted
  34 - order declined inscan
  35 - Order completed
  36 - delivered to customer, and pending for proof 
  37 - delivered to customer bypass, and pending for proof 
  38 - delivey accepted proof uploaded verification pending
  39 - delivey accepted proof rejected
  40 - order send to rework
  41 - delivery counter intransit
  
  100 - order editted
  101- sales order actived
  102- sales order disabled
  103- sales order deleted
  104- sales order general remark editted
  105- photography request generated
  106- Delivery pending
  107- Delivery counter received
  108- delivery counter rejected
  109 - product edtted 
  110 - rework to set process 
  111 - order hold 
  112 - order hold removed 
  113 - order split 
  114 - order split from another order 

  115 - halmark bundle created
  116 - halmark bundle assign hm center
  117 - halmark value updated
}
*/
