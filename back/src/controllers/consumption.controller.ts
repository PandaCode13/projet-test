import { Consumption } from '#models/consumption.model.js';
import { Product } from '#models/product.model.js';
import { AuthRequest } from '#types/index.js';
import { Response } from 'express-serve-static-core';

export const addConsumption = async (req: AuthRequest, res: Response) => {
  const { product, consumption } = req.body;
  const newProduct = await Product.create({
    name: product.name,
    barcode: product.barcode,
    brand: product.brand || '',
    imageUrl: product.imageUrl || '',
    sugar: product.sugar || 0,
    calories: product.calories || 0,
    caffeine: product.caffeine || 0
  });
  if (!newProduct) {
    return res.status(500).json({ message: 'Error adding product' });
  }
  const newConsumption = await Consumption.create({
    contributorId: req.userId,
    productId: newProduct._id,
    date: consumption.date,
    quantity: consumption.quantity,
    place: consumption.place || '',
    notes: consumption.notes || ''
  });
  if (!newConsumption) {
    return res.status(500).json({ message: 'Error adding consumption' });
  }
  return res.status(201).json({ message: 'Consumption added successfully', consumptionId: newConsumption._id });
};
