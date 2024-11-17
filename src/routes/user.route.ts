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
  savePost,
  unsavePost
} from '../controllers/user.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.get('/', getUser);
router.post('/', createUser);
router.post('/login', login);
router.post('/login-google', loginWithGoogle);
router.post('/refresh-token', refreshToken);
router.patch('/', authUserMiddleware, upload.array('images', 2), uploadUserImagesToCloudinary, updateUser);
router.patch('/block', authUserMiddleware, blockUser);
router.patch('/save-post', authUserMiddleware, savePost);
router.patch('/unsave-post', authUserMiddleware, unsavePost);

export default router;
