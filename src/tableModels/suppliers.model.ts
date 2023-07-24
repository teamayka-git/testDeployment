import * as mongoose from 'mongoose';
import { ModelNames } from 'src/common/model_names';
import { GlobalConfig } from 'src/config/global_config';

export const SuppliersSchema = new mongoose.Schema({
  //  _id: mongoose.Schema.Types.ObjectId,
  _uid: { type: String, required: true, default: 'nil' },
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.USER,
    default: null,
  },
  _cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.CITIES,
    default: null,
  },
  _accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.ACCOUNT_LEDGER,
    default: null,
  },
  _rateCardMasterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.RATE_CARDS,
    default: null,
  },
  _rateBaseMasterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.RATE_BASE_MASTERS,
    default: null,
  },
  _lastLogin: { type: Number, required: true, default: -1 },
  _address: { type: String, required: true, default: 'nil' },
  _gst: { type: String, required: false, default: '' },
  _dataGuard: { type: Object, required: true, default: [] },
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

export interface Suppliers {
  _id: String;
  _userId: string;
  _cityId: String;
  _uid: String;
  _lastLogin: Number;
  _address: String;
  _accountId: String;
  _rateCardMasterId:String;
  _rateBaseMasterId:String;
  _gst: String;
  _dataGuard: Object;
  _createdUserId: String;
  _createdAt: Number;
  _updatedUserId: String;
  _updatedAt: Number;
  _status: Number;
}

SuppliersSchema.index({ _rateBaseMasterId: 1 });
SuppliersSchema.index({ _rateCardMasterId: 1 });
SuppliersSchema.index({ _accountId: 1 });
SuppliersSchema.index({ _gst: 1 });
SuppliersSchema.index({ _status: 1 });
SuppliersSchema.index({ _name: 1 });
SuppliersSchema.index({ _gender: 1 });
SuppliersSchema.index({ _uid: 1, _id: 1 });
SuppliersSchema.index({ _cityId: 1 });
SuppliersSchema.index({ _userId: 1, _id: 1 });

SuppliersSchema.index({ _uid: 1 }, { unique: true });

SuppliersSchema.index(
  { _userId: 1 },
  { unique: true, partialFilterExpression: { _status: { $lt: 2 } } },
);
SuppliersSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
SuppliersSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
SuppliersSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
SuppliersSchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
SuppliersSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('User or Uid already existing'));
  } else {
    next();
  }
}

/*



*/
