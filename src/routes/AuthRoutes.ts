import express, { Request, Response } from 'express';
import * as authController from '../controllers/authController';
const authRoutes = express.Router();

authRoutes.post(
  '/auth',

  authController.authenticate
);

export default authRoutes;
