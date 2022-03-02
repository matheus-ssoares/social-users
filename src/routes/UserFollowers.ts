import express from 'express';
import * as userFollowersController from '../controllers/userFollowersController';
const userFollowersRoutes = express.Router();

userFollowersRoutes.get('/followers', userFollowersController.getFollow);
userFollowersRoutes.post('/followers', userFollowersController.followUser);
userFollowersRoutes.delete('/followers', userFollowersController.unfollowUser);

export default userFollowersRoutes;
