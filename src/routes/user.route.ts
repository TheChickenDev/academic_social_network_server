import express from 'express';
import { upload, uploadUserImagesToCloudinary } from '../middlewares/upload.middleware';
import {
  createUser,
  login,
  updateUser,
  blockUser,
  loginWithGoogle,
  refreshToken,
  getUser
} from '../controllers/user.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.get('/', authUserMiddleware, getUser);
router.post('/', createUser);
router.post('/login', login);
router.post('/login-google', loginWithGoogle);
router.post('/refresh-token', refreshToken);
router.patch('/', upload.array('images', 2), uploadUserImagesToCloudinary, updateUser);
router.patch('/block', authUserMiddleware, blockUser);

export default router;
