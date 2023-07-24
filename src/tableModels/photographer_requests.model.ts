import * as mongoose from 'mongoose';
import { ModelNames } from 'src/common/model_names';
import { GlobalConfig } from 'src/config/global_config';

export const PhotographerRequestsSchema = new mongoose.Schema({
  //  _id: mongoose.Schema.Types.ObjectId,
  _rootCauseId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.ROOT_CAUSES,
    default: null,
  },
  _orderItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.ORDER_SALES_ITEMS,
    default: null,
  },
  _designerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.PRODUCTS,
    default: null,
  },
  _requestStatus: { type: Number, required: true, default: -1 },
  _description: { type: String, default: 'nil' },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.USER,
    default: null,
  },
  _finishedAt: { type: Number, required: true, default: -1 },
  
  _uid: { type: String, required: true, default: 'nil' },
  _createdUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.USER,
    default: null,
  },
  _createdAt: { type: Number, required: true, default: -1 },
  _updatedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.USER,
    default: null,
  },
  _updatedAt: { type: Number, required: true, default: -1 },
  _status: { type: Number, required: true, default: -1 },
});

export interface PhotographerRequests {
  _id: String;
  _rootCauseId: String;
  _orderItemId: String;
  _designerId:string;
  _requestStatus: number;
  _description: String;
  _userId: String;
  _uid: string;
  _finishedAt: number;
  _createdUserId: String;
  _createdAt: Number;
  _updatedUserId: String;
  _updatedAt: Number;
  _status: Number;
}

PhotographerRequestsSchema.index({ _designerId: 1 });
PhotographerRequestsSchema.index({ _rootCauseId: 1 });
PhotographerRequestsSchema.index({ _orderItemId: 1 });
PhotographerRequestsSchema.index({ _requestStatus: 1 });
PhotographerRequestsSchema.index({ _description: 1 });
PhotographerRequestsSchema.index({ _userId: 1 });
PhotographerRequestsSchema.index({ _finishedAt: 1 });
PhotographerRequestsSchema.index({ _createdUserId: 1 });
PhotographerRequestsSchema.index({ _status: 1 });
PhotographerRequestsSchema.index({ _uid: 1, _id: 1 });

/*
_requestStatus:{
    0 - pending
    1 - accept
    2 - reject
    3 - completed
}
 */
