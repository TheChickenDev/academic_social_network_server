import express from 'express';
import { createPost, dislikePost, getPostById, getPosts, likePost } from '../controllers/post.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.post('/', authUserMiddleware, createPost);
router.get('/', getPosts);
router.get('/:id', authUserMiddleware, getPostById);
router.post('/:id/like', authUserMiddleware, likePost);
router.post('/:id/dislike', authUserMiddleware, dislikePost);

export default router;
