import { Request, Response } from 'express';
import commentService from '../services/comment.service';

// comment
export const comment = async (request: Request, response: Response) => {
  try {
    const result = await commentService.comment(request.body);
    return response.status(201).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};

// reply
export const replyComment = async (request: Request, response: Response) => {
  try {
    const result = await commentService.replyComment(request.body);
    return response.status(201).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};

// actions controller
export const actionsController = async (request: Request, response: Response) => {
  try {
    const { action } = request.query;
    const { id } = request.params;
    const { userId } = request.body;
    switch (action) {
      case 'like': {
        const result = await commentService.likeComment(id, userId);
        return response.status(200).json(result);
      }
      case 'dislike': {
        const result = await commentService.dislikeComment(id, userId);
        return response.status(200).json(result);
      }
      default:
        return response.status(400).json({
          message: 'Invalid action!'
        });
    }
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};

// get comments by post id
export const getCommentsByPostId = async (request: Request, response: Response) => {
  try {
    const { page, limit, postId } = request.query;
    const result = await commentService.getCommentsByPostId({
      postId: postId as string,
      page: parseInt(page as string, 10) ?? 1,
      limit: parseInt(limit as string, 10) ?? 10
    });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};
