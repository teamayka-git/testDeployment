import * as mongoose from 'mongoose';
import { ModelNames } from 'src/common/model_names';
import { GlobalConfig } from 'src/config/global_config';

export const DepartmentsSchema = new mongoose.Schema({
  //  _id: mongoose.Schema.Types.ObjectId,
  _name: { type: String, required: true, default: 'nil' },
  _prefix: { type: String, required: true, default: 'nil' },
  _processMasterStatus: { type: Number, required: true, default: -1 },
  _code: { type: Number, required: true, default: -1 },
  _dataGuard: { type: Object, required: true, default: [] },
  _permissions: { type: Object, required: true, default: [] },
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

export interface Departments {
  _id: string;
  _name: String;
  _prefix: String;
  _processMasterStatus: Number;
  _code: Number;
  _permissions:Object;
  _dataGuard: Object;
  _createdUserId: String;
  _createdAt: Number;
  _updatedUserId: String;
  _updatedAt: Number;
  _status: Number;
}

DepartmentsSchema.index({ _permissions: 1 });
DepartmentsSchema.index({ _status: 1 });
DepartmentsSchema.index({ _code: 1, _id: 1 });
DepartmentsSchema.index({ _name: 1, _id: 1 });
DepartmentsSchema.index({ _code: 1 }, { unique: true });
DepartmentsSchema.index(
  { _name: 1 },
  { unique: true, partialFilterExpression: { _status: { $lt: 2 } } },
);
DepartmentsSchema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
DepartmentsSchema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
DepartmentsSchema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
DepartmentsSchema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
DepartmentsSchema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('Name or Code already existing'));
  } else {
    next();
  }
}

/*
_code:{
    1000-order head,
    1001-sales executives
    1002-Relationship manager
    1003-Worker,
    1004-Photographer,
    1005-Delivery,
    
}
 */
