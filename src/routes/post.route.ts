import express from 'express';
import { createPost, getPostById, getPosts } from '../controllers/post.controller';
const router = express.Router();

router.post('/', createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);

export default router;
