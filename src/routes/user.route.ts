import express from 'express';
import { upload, uploadUserImagesToCloudinary } from '../middlewares/upload.middleware';
import {
  createUser,
  login,
  updateUser,
  blockUser,
  followUser,
  loginWithGoogle,
  refreshToken
} from '../controllers/user.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.post('/', createUser);
router.post('/login', login);
router.post('/login-google', loginWithGoogle);
router.post('/refresh-token', refreshToken);
router.patch('/', upload.array('images', 2), uploadUserImagesToCloudinary, authUserMiddleware, updateUser);
router.patch('/block', authUserMiddleware, blockUser);
router.patch('/follow', authUserMiddleware, followUser);

export default router;
