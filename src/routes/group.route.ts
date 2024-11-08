import express from 'express';
import { uploadUserImagesToCloudinary } from '../middlewares/upload.middleware';
import { authUserMiddleware } from '../middlewares/auth';
import { createGroup } from '../controllers/group.controller';
const router = express.Router();

router.post('/', uploadUserImagesToCloudinary, authUserMiddleware, createGroup);

export default router;
