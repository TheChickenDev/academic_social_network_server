import groupService from '../services/group.service';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

// create group
export const createGroup = async (request: Request, response: Response) => {
  try {
    const result = await groupService.createGroup(request.body);
    return response.status(201).json(result);
  } catch (error) {
    if (request.body.publicIds && request.body.publicIds.length > 0) {
      for (const publicId of request.body.publicIds) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
    return response.status(404).json({
      message: error.message
    });
  }
};
