import { Request, Response } from 'express';
import commentService from '../services/comment.service';

// comment
export const comment = async (request: Request, response: Response) => {
  try {
    const result = await commentService.comment(request.body);
    return response.status(200).json(result);
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
    return response.status(200).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};
