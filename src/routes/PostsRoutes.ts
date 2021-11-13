import express from 'express';
import { protect } from '../controllers/authController';
import * as postsController from '../controllers/postsController';
import * as postCommentsController from '../controllers/postCommentsController';
const postsRoutes = express.Router();

postsRoutes.post('/posts', protect, postsController.createPost);

postsRoutes.get('/posts', protect, postsController.getAllPosts);

postsRoutes.post('/posts/likes', protect, postsController.createPostLike);

postsRoutes.delete('/posts/likes/:id', protect, postsController.deletePostLike);

postsRoutes.get('/posts/likes/:id', protect, postsController.getAllPostLikes);

postsRoutes.post(
  '/posts/comments',
  protect,
  postCommentsController.createPostComment
);

export default postsRoutes;
