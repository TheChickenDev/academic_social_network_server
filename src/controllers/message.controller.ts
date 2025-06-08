import { Request, Response } from 'express';
import messageService from '../services/message.service';

// get messages

export const getMessages = async (request: Request, response: Response) => {
  try {
    const { conversationId, userId, page, limit } = request.query;
    const result = await messageService.getMessages({
      conversationId: conversationId as string,
      userId: userId as string,
      page: parseInt(page as string, 10) ?? 1,
      limit: parseInt(limit as string, 10) ?? 10
    });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
    });
  }
};
