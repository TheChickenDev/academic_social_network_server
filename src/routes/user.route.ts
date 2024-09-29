import express from 'express';
import { upload, uploadUserImagesToCloudinary } from '../middlewares/upload.middleware';
import {
  createUser,
  login,
  updateUser,
  blockUser,
  followUser,
  createGroup,
  loginWithGoogle
} from '../controllers/user.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);
router.post('/login-google', loginWithGoogle);
router.put('/update', upload.array('images', 2), uploadUserImagesToCloudinary, authUserMiddleware, updateUser);
router.put('/block', authUserMiddleware, blockUser);
router.put('/follow', authUserMiddleware, followUser);
router.post('/create-group', authUserMiddleware, createGroup);

export default router;
