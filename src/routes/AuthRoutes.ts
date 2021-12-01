import express, { Request, Response } from 'express';
import * as authController from '../controllers/authController';
const authRoutes = express.Router();

authRoutes.post('/auth', authController.authenticate);
authRoutes.post('/auth/refresh-token', authController.refreshToken);

export default authRoutes;
