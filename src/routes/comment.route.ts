import express from 'express';
import { comment, replyComment } from '../controllers/comment.controller';
const router = express.Router();

router.post('/', comment);
router.post('/reply', replyComment);

export default router;
