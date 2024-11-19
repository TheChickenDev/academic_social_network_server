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
    return response.status(400).json({
      message: error.message
    });
  }
};

// get group

export const getGroups = async (request: Request, response: Response) => {
  try {
    const { id, ownerEmail, userEmail } = request.query;
    const result = await groupService.getGroups({
      id: id as string,
      ownerEmail: ownerEmail as string,
      userEmail: userEmail as string
    });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// update group

export const updateGroup = async (request: Request, response: Response) => {
  try {
    const result = await groupService.updateGroup(request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// get members

export const getMembers = async (request: Request, response: Response) => {
  try {
    const { id, memberRole } = request.query;
    const result = await groupService.getMembers({
      id: id as string,
      memberRole: (memberRole as 'member' | 'moderator' | 'admin') ?? 'member'
    });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};
