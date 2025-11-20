import { model, Schema } from 'mongoose';

export interface IProduct {
  name: string;
  brand?: string;
  barcode: string;
  imageUrl?: string;
  sugar?: number;
  caffeine?: number;
  calories: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String },
    barcode: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    sugar: { type: Number },
    caffeine: { type: Number },
    calories: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Product = model('Product', productSchema);
