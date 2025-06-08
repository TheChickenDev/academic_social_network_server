import { Request, Response } from 'express';
import conversationService from '../services/conversation.service';

// get conversations

export const getConversations = async (request: Request, response: Response) => {
  try {
    const { userId, page, limit } = request.query;
    const result = await conversationService.getConversations({
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
