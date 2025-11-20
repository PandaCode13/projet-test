import { addConsumption, getConsumptions, modifyConsumption } from '#controllers/consumption.controller.js';
import { authMiddleware } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createConsumptionSchema } from '#types/consumption.validation.js';
import { Router } from 'express';

const router = Router();

router.get('/',getConsumptions)
router.post('/', authMiddleware, validate(createConsumptionSchema), addConsumption);
router.put('/:consumptionId', authMiddleware, validate(createConsumptionSchema), modifyConsumption);

export default router;
