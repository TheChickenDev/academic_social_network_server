import express from 'express';
import { authUserMiddleware } from '../middlewares/auth';
import { getConversations } from '../controllers/conversation.controller';
const router = express.Router();

router.get('/', authUserMiddleware, getConversations);

export default router;
