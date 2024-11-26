import express from 'express';
import { actionsController, comment, getCommentsByPostId, replyComment } from '../controllers/comment.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.post('/', authUserMiddleware, comment);
router.post('/replies', authUserMiddleware, replyComment);
router.post('/:id', authUserMiddleware, actionsController);
router.get('/', getCommentsByPostId);

export default router;
