import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AccountDocument = mongoose.HydratedDocument<Account>;

@Schema({
  toObject: {
    //delete __v from output object
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
  toJSON: {
    //delete __v from output JSON
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Account {
  id: mongoose.Types.ObjectId;

  @Prop()
  balance: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
