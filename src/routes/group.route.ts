import express from 'express';
import { upload, uploadGroupImagesToCloudinary } from '../middlewares/upload.middleware';
import { authUserMiddleware } from '../middlewares/auth';
import {
  createGroup,
  getGroups,
  getMembers,
  getPosts,
  memberRequestController,
  postRequestController,
  updateGroup
} from '../controllers/group.controller';
const router = express.Router();

router.post('/', authUserMiddleware, createGroup);
router.get('/', getGroups);
router.patch('/', authUserMiddleware, upload.array('images', 1), uploadGroupImagesToCloudinary, updateGroup);
router.get('/members', getMembers);
router.patch('/members', authUserMiddleware, memberRequestController);
router.get('/posts', getPosts);
router.patch('/posts', authUserMiddleware, postRequestController);

export default router;
