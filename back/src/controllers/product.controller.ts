import { Product } from '#models/product.model.js';
import { ProductsQueryType } from '#types/index.js';
import { Request, Response } from 'express-serve-static-core';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { query, page, external } = req.query as ProductsQueryType;
    const pageInt = page ? parseInt(page) : 1;
    const limit = 20;
    const skip = (pageInt - 1) * limit;
    console.log('Products Request');
    // find products in the database
    const productsDb = await Product.find({
      $or: [{ name: { $regex: query, $options: 'i' }, barcode: { $regex: query, $options: 'i' } }]
    })
      .skip(skip)
      .limit(limit);
    const total = await Product.countDocuments({
      $or: [{ name: { $regex: query, $options: 'i' } }, { barcode: { $regex: query, $options: 'i' } }]
    });
    console.log(productsDb);
    console.log(total);
    if (productsDb.length > 0) {
      console.log('Products Request DB');
      return res.status(200).json({ results: productsDb, total, page: pageInt, totalPages: Math.ceil(total / limit) });
    } else if (external || productsDb.length === 0) {
      console.log('Products Request API');
      // if no results, search external API and save to database
      const productsApi = await fetch(
        `https://fr.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&fields=code,product_name,product_name_fr,brands,image_url,nutriments&page=${pageInt}`
      );
      const productsData = await productsApi.json();
      return res.status(200).json(productsData);
    }
  } catch (error) {
    console.log('Error finding products', error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, barcode, brand, imageUrl, sugar, calories, caffeine } = req.body;
    const productExists = await Product.findOne({ barcode });
    if (productExists) {
      return res.status(400).json({ message: 'Product with this barcode already exists' });
    }
    const newProduct = await Product.create({
      name,
      barcode,
      brand: brand || '',
      imageUrl: imageUrl || '',
      sugar: sugar || 0,
      calories: calories || 0,
      caffeine: caffeine || 0
    });
    if (!newProduct) {
      return res.status(500).json({ message: 'Error creating product' });
    }
    return res.status(201).json({ message: 'Product created successfully', productId: newProduct._id });
  } catch (error) {
    console.error('Error creating product: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
