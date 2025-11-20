import { dashboardStatistics, getAnalytics } from '#controllers/statistics.controller.js';
import { Router } from 'express';

const router = Router();

router.get('/dashboard', dashboardStatistics)
router.get('/analytics', getAnalytics)

export default router;