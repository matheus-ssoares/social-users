import express from 'express';
import { protect } from '../controllers/authController';

import * as postCommentsController from '../controllers/postCommentsController';
const postCommentRoutes = express.Router();

postCommentRoutes.post(
  '/posts/comments',
  protect,
  postCommentsController.createPostComment
);

postCommentRoutes.get(
  '/posts/comments/:id',
  protect,
  postCommentsController.getAllPostComments
);

export default postCommentRoutes;
