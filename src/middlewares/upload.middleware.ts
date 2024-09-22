import dotenv from 'dotenv';
import multer, { Multer } from 'multer';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer;
}

const storage = multer.memoryStorage();
export const upload: Multer = multer({ storage: storage });

export const uploadUserImagesToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files: CloudinaryFile[] = req.files as CloudinaryFile[];
    if (!files || files.length === 0) {
      return next();
    }
    const cloudinaryUrls: string[] = [];
    const publicIds: string[] = [];
    for (const file of files) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'academic_social_network/user'
        } as any,
        (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (err) {
            console.error('Cloudinary upload error:', err);
            return next(err);
          }
          if (!result) {
            console.error('Cloudinary upload error: Result is undefined');
            return next(new Error('Cloudinary upload result is undefined'));
          }
          cloudinaryUrls.push(result.secure_url);
          publicIds.push(result.public_id);

          if (cloudinaryUrls.length === files.length) {
            req.body.cloudinaryUrls = cloudinaryUrls;
            req.body.publicIds = publicIds;
            next();
          }
        }
      );
      uploadStream.end(file.buffer);
    }
  } catch (error) {
    console.error('Error in uploadToCloudinary middleware:', error);
    next(error);
  }
};
