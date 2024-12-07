import express from 'express';
import { getNotifications } from '../controllers/notification.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.get('/', authUserMiddleware, getNotifications);

export default router;
