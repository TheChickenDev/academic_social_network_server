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

// get group

export const getGroups = async (request: Request, response: Response) => {
  try {
    const { id, ownerEmail } = request.query;
    const result = await groupService.getGroups({
      id: id as string,
      ownerEmail: ownerEmail as string
    });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};
