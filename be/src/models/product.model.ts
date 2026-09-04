import { Schema, model } from 'mongoose';
import { IProduct } from '../types/product';

const PriceSchema = new Schema(
  {
    value: { type: Number, required: true },
    currency: { type: String, required: true },
    installment: {
      value: { type: Number, required: true },
      period: { type: Number, required: true },
    },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    image: { type: String, required: true },
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    capacity: { type: Number, required: true, enum: [8, 9, 10.5] },
    dimensions: { type: String, required: true },
    features: [{ type: String }],
    energyClass: { type: String, required: true, enum: ['A', 'B', 'C'] },
    price: { type: PriceSchema, required: true },
  },
  {
    timestamps: true,
  }
);

export const Product = model('Product', ProductSchema);
