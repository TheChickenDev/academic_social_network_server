import express from 'express';
import { upload } from '../middlewares/uploadFile';
import { createUser, login } from '../controllers/user.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);

export default router;
