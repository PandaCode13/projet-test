import { Consumption } from '#models/consumption.model.js';
import { Product } from '#models/product.model.js';
import { Statistics } from '#models/statistics.model.js';
import { AuthRequest } from '#types/index.js';
import { Request, Response } from 'express-serve-static-core';

export const getConsumptions = async (req: Request, res: Response) => {
  try {
    const { page } = req.query as { page: string };
    const pageInt = page ? parseInt(page) : 1;
    const limit = 20;
    const skip = (pageInt - 1) * limit;
    const consumptions = await Consumption.find().select('-notes').populate('contributorId', 'firstName lastName').populate('product', 'name barcode brand imageUrl sugar calories caffeine').limit(limit).skip(skip);
    const total = await Consumption.countDocuments();
    return res
      .status(200)
      .json({ results: consumptions, total, page: pageInt, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching consumptions: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const addConsumption = async (req: AuthRequest, res: Response) => {
  const { product, consumption } = req.body;
  console.log('Request Body:', req.body);
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
    product: newProduct,
    date: consumption.date,
    quantity: consumption.quantity,
    place: consumption.place || '',
    notes: consumption.notes || ''
  });
  if (!newConsumption) {
    return res.status(500).json({ message: 'Error adding consumption' });
  }
  // find statistics document for today and update it
  const statDate = new Date(consumption.date);
  statDate.setHours(0, 0, 0, 0);
  let stats = await Statistics.findOne({ date: statDate });
  if (!stats) {
    stats = await Statistics.create({
      date: statDate,
      totalConsumptions: 1,
      totalSugar: (newProduct.sugar || 0) * consumption.quantity,
      totalCaffeine: (newProduct.caffeine || 0) * consumption.quantity,
      totalCalories: (newProduct.calories || 0) * consumption.quantity
    });
  } else {
    stats.totalConsumptions += 1;
    stats.totalSugar += (newProduct.sugar || 0) * consumption.quantity;
    stats.totalCaffeine += (newProduct.caffeine || 0) * consumption.quantity;
    stats.totalCalories += (newProduct.calories || 0) * consumption.quantity;
    await stats.save();
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
