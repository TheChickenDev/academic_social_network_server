import { Request, Response } from 'express';
import postService from '../services/post.service';
import ReactDOMServer from 'react-dom/server';
import { isBot } from '../utils/user.utils';
import Post from '../components/post';
import fs from 'fs';
import path from 'path';

// create post
export const createPost = async (request: Request, response: Response) => {
  try {
    const result = await postService.createPost(request.body);
    return response.status(201).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// get posts
export const getPosts = async (request: Request, response: Response) => {
  try {
    const userAgent = request.headers['user-agent'] || '';
    const isBotVisitor = isBot(userAgent);

    if (isBotVisitor) {
      const templatePath = path.resolve(__dirname, '../views/template.html');
      const template = fs.readFileSync(templatePath, 'utf8');
      return response.send(template);
    }

    const { page, limit, userId, groupId, type } = request.query;
    if (limit === '0') {
      const result = await postService.getPostsForAdmin({
        page: parseInt(page as string, 10) ?? 1,
        limit: parseInt(limit as string, 10) ?? 10
      });
      return response.status(200).json(result);
    }
    switch (type) {
      case 'own': {
        const result = await postService.getOwnPosts({
          page: parseInt(page as string, 10) ?? 1,
          limit: parseInt(limit as string, 10) ?? 10,
          userId: userId as string
        });
        return response.status(200).json(result);
      }
      case 'saved': {
        const result = await postService.getSavedPosts({
          page: parseInt(page as string, 10) ?? 1,
          limit: parseInt(limit as string, 10) ?? 10,
          userId: userId as string
        });
        return response.status(200).json(result);
      }
      case 'group': {
        const result = await postService.getGroupPosts({
          page: parseInt(page as string, 10) ?? 1,
          limit: parseInt(limit as string, 10) ?? 10,
          groupId: groupId as string
        });
        return response.status(200).json(result);
      }
      case 'inGroups': {
        const result = await postService.getRandomPostsByGroups({
          page: parseInt(page as string, 10) ?? 1,
          limit: parseInt(limit as string, 10) ?? 10,
          userId: userId as string
        });
        return response.status(200).json(result);
      }
      default: {
        const result = await postService.getRandomPosts({
          page: parseInt(page as string, 10) ?? 1,
          limit: parseInt(limit as string, 10) ?? 10,
          userId: userId as string
        });
        return response.status(200).json(result);
      }
    }
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// update post
export const updatePost = async (request: Request, response: Response) => {
  try {
    const result = await postService.updatePost(request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// delete post
export const deletePost = async (request: Request, response: Response) => {
  try {
    const result = await postService.deletePost(request.params.id);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
    });
  }
};

// get post by id
export const getPostById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { userEmail } = request.query;
    const result = (await postService.getPostById(id, userEmail as string)) as {
      message: string;
      data: any;
    };
    const userAgent = request.headers['user-agent'] || '';
    const isBotVisitor = isBot(userAgent);

    if (isBotVisitor) {
      const appHtml = ReactDOMServer.renderToString(<Post post={result?.data} />);

      const templatePath = path.resolve(__dirname, '../views/template.html');
      const template = fs.readFileSync(templatePath, 'utf8');

      const html = template.replace('<!--APP-->', appHtml).replace('<!--TITLE-->', result?.data?.title || 'Post');
      return response.send(html);
    }
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
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
        const result = await postService.likePost(id, userId);
        return response.status(200).json(result);
      }
      case 'dislike': {
        const result = await postService.dislikePost(id, userId);
        return response.status(200).json(result);
      }
      default: {
        return response.status(400).json({
          message: 'Invalid action'
        });
      }
    }
  } catch (error) {
    return response.status(400).json({
      message: error instanceof Error ? error.message : String(error)
    });
  }
};
