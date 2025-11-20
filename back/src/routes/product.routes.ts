import { createProduct, getProduct, getProducts } from '#controllers/product.controller.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createProductSchema } from '#types/products.validation.js';
import { Router } from 'express';

const router = Router();

router.get('/', getProducts);
router.get('/:productId', getProduct);
router.post('/', validate(createProductSchema), createProduct);

export default router;
