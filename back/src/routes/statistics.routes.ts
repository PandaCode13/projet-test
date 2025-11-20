import { dashboardStatistics } from '#controllers/statistics.controller.js';
import { Router } from 'express';

const router = Router();

router.get('/', dashboardStatistics)

export default router;