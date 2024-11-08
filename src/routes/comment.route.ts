import express from 'express';
import {
  comment,
  dislikeComment,
  getCommentsByPostId,
  likeComment,
  replyComment
} from '../controllers/comment.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.post('/', authUserMiddleware, comment);
router.post('/reply', authUserMiddleware, replyComment);
router.post('/:id/like', authUserMiddleware, likeComment);
router.post('/:id/dislike', authUserMiddleware, dislikeComment);
router.get('/', getCommentsByPostId);

export default router;
