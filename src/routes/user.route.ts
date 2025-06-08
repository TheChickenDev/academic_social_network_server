import express, { RequestHandler } from 'express';
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
  controlFriendRequest,
  getFriends,
  forgotPassword,
  resetPassword,
  deleteUser
} from '../controllers/user.controller';
import { authAdminMiddleware, authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.get('/', getUser);
router.post('/', createUser);
router.post('/login', login);
router.post('/login-google', loginWithGoogle);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.patch(
  '/',
  authUserMiddleware,
  upload.array('images', 1) as unknown as RequestHandler,
  uploadUserImagesToCloudinary,
  updateUser
);
router.delete('/', authAdminMiddleware, deleteUser);
router.patch('/friends', authUserMiddleware, controlFriendRequest);
router.get('/friends', getFriends);
router.patch('/posts', authUserMiddleware, controlPostRequest);
router.patch('/block', authUserMiddleware, blockUser);

export default router;
