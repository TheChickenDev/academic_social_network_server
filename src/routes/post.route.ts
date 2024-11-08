import express from 'express';
import {
  createPost,
  deletePost,
  dislikePost,
  getPostById,
  getPosts,
  likePost,
  updatePost
} from '../controllers/post.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.post('/', authUserMiddleware, createPost);
router.get('/', getPosts);
router.patch('/', updatePost);
router.delete('/:id', deletePost);
router.get('/:id', getPostById);
router.post('/:id/like', authUserMiddleware, likePost);
router.post('/:id/dislike', authUserMiddleware, dislikePost);

export default router;
