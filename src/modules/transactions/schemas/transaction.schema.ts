import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type TransactionDocument = mongoose.HydratedDocument<Transaction>;

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
export class Transaction {
  @Prop({
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({
    type: Number,
    required: true,
  })
  value: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  account: string; // string as mongoose.Schema.Types.ObjectId has issues when fetching transactions
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
