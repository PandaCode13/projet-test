import { model, Schema, Types } from 'mongoose';
import { IUser } from './user.model.js';
import { IProduct } from './product.model.js';

export interface IConsumption {
  time: Date;
  product: Types.ObjectId | IProduct;
  quantity: number;
  contributorId: Types.ObjectId | IUser;
  place?: string;
  notes?: string;
}

const consumptionSchema = new Schema<IConsumption>(
  {
    time: { type: Date, default: Date.now },
    product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    quantity: { type: Number, required: true, default: 1 },
    contributorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    place: { type: String },
    notes: { type: String }
  },
  {
    timestamps: true
  }
);

export const Consumption = model('Consumption', consumptionSchema);
