import express from 'express';
import {
  actionsController,
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost
} from '../controllers/post.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.post('/', authUserMiddleware, createPost);
router.get('/', getPosts);
router.patch('/', updatePost);
router.delete('/:id', deletePost);
router.get('/:id', getPostById);
router.post('/:id', authUserMiddleware, actionsController);

export default router;
