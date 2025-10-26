import { Router } from "express";

const router = Router()

router.post('/login');
router.post('/register');
router.post('/refresh-token');
router.post('/logout');

export default router;