import express from 'express';
import { authUserMiddleware } from '../middlewares/auth';
import { getMessages } from '../controllers/message.controller';
const router = express.Router();

router.get('/', authUserMiddleware, getMessages);

export default router;
