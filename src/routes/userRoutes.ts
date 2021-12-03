import express, { Request, Response } from 'express';
import { protect } from '../controllers/authController';
import * as userController from '../controllers/userController';
import { UserRegister } from '../interfaces/userInterfaces';
const userRoutes = express.Router();

userRoutes.get('/users/:id', userController.getUser);

userRoutes.get('/users/posts/:id/:skip', userController.getPostsByUser);

userRoutes.post(
  '/users',

  (req: Request<any, any, UserRegister>, res: Response) => {
    userController.userRegister(req, res);
  }
);
userRoutes.patch('/users', protect, userController.updateUser);

export default userRoutes;
