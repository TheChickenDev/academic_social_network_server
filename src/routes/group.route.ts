import express from 'express';
import { uploadUserImagesToCloudinary } from '../middlewares/upload.middleware';
import { authUserMiddleware } from '../middlewares/auth';
import { createGroup, getGroups } from '../controllers/group.controller';
const router = express.Router();

router.post('/', authUserMiddleware, createGroup);
router.get('/', getGroups);

export default router;
