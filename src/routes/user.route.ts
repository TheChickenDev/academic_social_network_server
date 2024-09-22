import express from 'express';
import { upload, uploadUserImagesToCloudinary } from '../middlewares/upload.middleware';
import { createUser, login, updateUser } from '../controllers/user.controller';
import { authUserMiddleware } from '../middlewares/auth';
const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);
router.put('/update', upload.array('images', 2), uploadUserImagesToCloudinary, authUserMiddleware, updateUser);

export default router;
