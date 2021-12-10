import express from 'express';
import * as userFollowersController from '../controllers/userFollowersController';
import { protect } from '../controllers/authController';
const userFollowersRoutes = express.Router();

userFollowersRoutes.post(
  '/follower',
  protect,
  userFollowersController.followUser
);
userFollowersRoutes.delete(
  '/follower',
  protect,
  userFollowersController.unfollowUser
);

export default userFollowersRoutes;
