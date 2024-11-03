import express from 'express';
import { createPost, dislikePost, getPostById, getPosts, likePost } from '../controllers/post.controller';
const router = express.Router();

router.post('/', createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/:id/like', likePost);
router.post('/:id/dislike', dislikePost);

export default router;
