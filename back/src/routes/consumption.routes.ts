import { addConsumption } from '#controllers/consumption.controller.js';
import { authMiddleware } from '#middlewares/auth.middleware.js';
import { validate } from '#middlewares/validate.middleware.js';
import { createConsumptionSchema } from '#types/consumption.validation.js';
import { Router } from 'express';

const router = Router();

router.post('/consumption', authMiddleware, validate(createConsumptionSchema), addConsumption);


export default router;
