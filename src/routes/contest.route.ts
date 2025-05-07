import express from 'express';
import { authAdminMiddleware, authUserMiddleware } from '../middlewares/auth';
import { createContest, getContests, updateContest } from '../controllers/contest.controller';
const router = express.Router();

router.post('/', authAdminMiddleware, createContest);
router.get('/', getContests);
router.patch('/', authAdminMiddleware, updateContest);

export default router;
