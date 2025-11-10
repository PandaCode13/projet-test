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

export const modifyConsumption = async (req: AuthRequest, res: Response) => {
  const { consumptionId } = req.params;
  const consumption = await Consumption.findById(consumptionId);
  if (!consumption) {
    return res.status(404).json({ message: 'Consumption not found' });
  }
  const isOwner = consumption?.contributorId.toString() === req.userId;
  if (!isOwner) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { time, quantity, place, notes } = req.body;
  consumption.time = time || consumption.time;
  consumption.quantity = quantity || consumption.quantity;
  consumption.place = place || consumption.place;
  consumption.notes = notes || consumption.notes;
  try {
    await consumption.save();
    return res.status(200).json({ message: 'Consumption updated successfully' });
  } catch (error) {
    console.error('Error updating consumption: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
