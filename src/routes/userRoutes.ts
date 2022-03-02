import express, { Request, Response } from 'express';
import { protect } from '../controllers/authController';
import * as userController from '../controllers/userController';
import { UserRegister } from '../interfaces/userInterfaces';
const userRoutes = express.Router();

userRoutes.get('/users/me', userController.getMe);
userRoutes.get('/users', userController.getUser);

userRoutes.post(
  '/users',

  (req: Request<any, any, UserRegister>, res: Response) => {
    userController.userRegister(req, res);
  }
);
userRoutes.patch('/users', userController.updateUser);

export default userRoutes;
