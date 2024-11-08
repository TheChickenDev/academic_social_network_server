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

// like comment
export const likeComment = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { commentId, ...actionInfo } = request.body;
    const result = await commentService.likeComment(id, commentId, actionInfo);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};

// dislike comment
export const dislikeComment = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { commentId, ...actionInfo } = request.body;
    const result = await commentService.dislikeComment(id, commentId, actionInfo);
    return response.status(200).json(result);
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
