import express from 'express';
import { upload, uploadGroupImagesToCloudinary } from '../middlewares/upload.middleware';
import { authUserMiddleware } from '../middlewares/auth';
import { createGroup, getGroups, getMembers, updateGroup } from '../controllers/group.controller';
const router = express.Router();

router.post('/', authUserMiddleware, createGroup);
router.get('/', getGroups);
router.patch('/', authUserMiddleware, upload.array('images', 1), uploadGroupImagesToCloudinary, updateGroup);
router.get('/members', getMembers);

export default router;
