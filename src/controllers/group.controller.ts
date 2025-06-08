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
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// get group

export const getGroups = async (request: Request, response: Response) => {
  try {
    const { id, userId, page, limit, type } = request.query;
    if (limit === '0') {
      const result = await groupService.getGroupsForAdmin({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10
      });
      return response.status(200).json(result);
    }
    switch (type) {
      case 'byId': {
        const result = await groupService.getGroupById({
          id: id as string,
          userId: userId as string
        });
        return response.status(200).json(result);
      }
      case 'own': {
        const result = await groupService.getOwnGroups({
          userId: userId as string,
          page: page ? parseInt(page as string, 10) : 1,
          limit: limit ? parseInt(limit as string, 10) : 10
        });
        return response.status(200).json(result);
      }
      case 'joined': {
        const result = await groupService.getJoinedGroups({
          userId: userId as string,
          page: page ? parseInt(page as string, 10) : 1,
          limit: limit ? parseInt(limit as string, 10) : 10
        });
        return response.status(200).json(result);
      }
      default:
        const result = await groupService.getRandomGroups({
          userId: userId as string,
          page: page ? parseInt(page as string, 10) : 1,
          limit: limit ? parseInt(limit as string, 10) : 10
        });
        return response.status(200).json(result);
    }
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
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
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// delete group

export const deleteGroup = async (request: Request, response: Response) => {
  try {
    const result = await groupService.deleteGroup(request.params.id);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// get members

export const getMembers = async (request: Request, response: Response) => {
  try {
    const { id, memberRole, userId } = request.query;
    const result = await groupService.getMembers({
      id: id as string,
      memberRole: (memberRole as 'pending' | 'member' | 'moderator' | 'admin') ?? 'all',
      userId: userId as string
    });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// member request

export const memberRequestController = async (request: Request, response: Response) => {
  try {
    const { action } = request.query;
    if (action === 'request') {
      const result = await groupService.requestToJoin(request.body);
      return response.status(200).json(result);
    } else if (action === 'accept') {
      const result = await groupService.acceptJoinRequest(request.body);
      return response.status(200).json(result);
    } else if (action === 'leave' || action === 'remove' || action === 'reject') {
      const result = await groupService.removeMember(request.body);
      return response.status(200).json(result);
    } else if (action === 'appoint') {
      const result = await groupService.appointModerator(request.body);
      return response.status(200).json(result);
    } else if (action === 'dismissal') {
      const result = await groupService.dismissalModerator(request.body);
      return response.status(200).json(result);
    }
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// get posts

export const getPosts = async (request: Request, response: Response) => {
  try {
    const { id, postStatus } = request.query;
    const result = await groupService.getPosts({
      id: id as string,
      postStatus: (postStatus as 'pending' | 'approved' | 'rejected' | 'all') ?? 'all'
    });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// post controller

export const postRequestController = async (request: Request, response: Response) => {
  try {
    const { action } = request.query;
    if (action === 'approve') {
      const result = await groupService.approvePost(request.body);
      return response.status(200).json(result);
    } else if (action === 'reject') {
      const result = await groupService.rejectPost(request.body);
      return response.status(200).json(result);
    }
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
    });
  }
};
