import express from 'express';
import { authAdminMiddleware, authUserMiddleware } from '../middlewares/auth';
import { createProblem, createSubmission, getProblems, updateProblem } from '../controllers/problem.controller';
const router = express.Router();

router.post('/', authAdminMiddleware, createProblem);
router.get('/', getProblems);
router.patch('/', authAdminMiddleware, updateProblem);
router.post('/submit', authUserMiddleware, createSubmission);

export default router;
