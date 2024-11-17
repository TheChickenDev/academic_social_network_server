import express from 'express';
import { upload, uploadUserImagesToCloudinary } from '../middlewares/upload.middleware';
import {
  createUser,
  login,
  updateUser,
  blockUser,
  loginWithGoogle,
  refreshToken,
  getUser,
  controlPostRequest,
  controlFriendRequest
} from '../controllers/user.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.get('/', getUser);
router.post('/', createUser);
router.post('/login', login);
router.post('/login-google', loginWithGoogle);
router.post('/refresh-token', refreshToken);
router.patch('/', authUserMiddleware, upload.array('images', 1), uploadUserImagesToCloudinary, updateUser);
router.patch('/friends', authUserMiddleware, controlFriendRequest);
router.patch('/posts', authUserMiddleware, controlPostRequest);
router.patch('/block', authUserMiddleware, blockUser);

export default router;
