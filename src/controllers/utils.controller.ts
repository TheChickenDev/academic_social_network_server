// search all

import { Request, Response } from 'express';
import { searchAll, searchGroups, searchPosts, searchUsers } from '../services/utils.service';

export const searchController = async (request: Request, response: Response) => {
  try {
    const { q, type, filter, email, page, limit } = request.query;
    if (type === 'all') {
      const result = await searchAll({
        q: q as string,
        email: email as string
      });
      return response.status(200).json(result);
    } else if (type === 'posts') {
      const result = await searchPosts({
        q: q as string,
        filter: filter as string,
        page: parseInt(page as string, 10) ?? 1,
        limit: parseInt(limit as string, 10) ?? 10
      });
      return response.status(200).json(result);
    } else if (type === 'users') {
      const result = await searchUsers({
        email: email as string,
        q: q as string,
        filter: filter as string,
        page: parseInt(page as string, 10) ?? 1,
        limit: parseInt(limit as string, 10) ?? 10
      });
      return response.status(200).json(result);
    } else if (type === 'groups') {
      const result = await searchGroups({
        email: email as string,
        q: q as string,
        filter: filter as string,
        page: parseInt(page as string, 10) ?? 1,
        limit: parseInt(limit as string, 10) ?? 10
      });
      return response.status(200).json(result);
    }
    return response.status(400).json({
      message: 'Invalid type'
    });
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};
