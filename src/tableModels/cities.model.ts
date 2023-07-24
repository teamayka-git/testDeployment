import * as mongoose from 'mongoose';
import { ModelNames } from 'src/common/model_names';
import { GlobalConfig } from 'src/config/global_config';


export const CitiesSchema = new mongoose.Schema({
  //  _id: mongoose.Schema.Types.ObjectId,
    _name: { type: String, required: true, default: "nil" },
    _code:  { type: Number, required: true, default: -1 },
    _districtsId: { type: mongoose.Schema.Types.ObjectId, ref: ModelNames.DISTRICTS, default: null },
    _dataGuard: { type:Object, required: true, default: [] },
    _createdUserId: { type: mongoose.Schema.Types.ObjectId, ref: ModelNames.USER, default: null },
    _createdAt: { type: Number, required: true, default: -1 },
    _updatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: ModelNames.USER, default: null },
    _updatedAt: { type: Number, required: true, default: -1 },
    _status: { type: Number, required: true, default: -1 },
});
 
export interface Cities {
    _id: String;
    _name: String;
    _code: Number;
    _districtsId:String;
    _dataGuard:Object;
    _createdUserId:String;
    _createdAt:  Number;
    _updatedUserId: String;
    _updatedAt:  Number;
    _status: Number;
}

CitiesSchema.index({_status: 1});
CitiesSchema.index({_districtsId: 1});
CitiesSchema.index({_name: 1,_id:1});
CitiesSchema.index({_code: 1,_id:1});
CitiesSchema.index({_code: 1}, {unique: true,});
CitiesSchema.index({_name: 1}, {unique: true,partialFilterExpression: { _status: { $lt: 2 } }});
CitiesSchema.post('save', async function(error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
});
CitiesSchema.post('insertMany', async function(error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
});
CitiesSchema.post('updateOne', async function(error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
});
CitiesSchema.post('findOneAndUpdate', async function(error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
});
CitiesSchema.post('updateMany', async function(error, doc, next) {
    schemaPostFunctionForDuplicate(error, doc, next);
});
function schemaPostFunctionForDuplicate(error, doc, next) {
    if(error.code==11000){
        next(new Error('Code or Name already existing'));
   }else{
    next();
   }
}


/*
*/