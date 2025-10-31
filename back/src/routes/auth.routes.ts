import { login, logout, refreshToken, register } from "#controllers/auth.controller.js";
import { validate } from "#middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "#types/user.validation.js";
import { Router } from "express";

const router = Router()

router.post('/login',validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;