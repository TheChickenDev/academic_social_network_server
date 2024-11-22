import express from 'express';
import { authUserMiddleware } from '../middlewares/auth';
import { searchController } from '../controllers/utils.controller';
const router = express.Router();

router.get('/search', authUserMiddleware, searchController);

export default router;
