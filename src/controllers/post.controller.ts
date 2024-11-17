import { Request, Response } from 'express';
import postService from '../services/post.service';

// create post
export const createPost = async (request: Request, response: Response) => {
  try {
    const result = await postService.createPost(request.body);
    return response.status(201).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// get posts
export const getPosts = async (request: Request, response: Response) => {
  try {
    const { page, limit, ownerEmail, userEmail, getSavedPosts } = request.query;
    const result = await postService.getPosts({
      page: parseInt(page as string, 10) ?? 1,
      limit: parseInt(limit as string, 10) ?? 10,
      userEmail: userEmail as string,
      ownerEmail: ownerEmail as string,
      getSavedPosts: getSavedPosts === 'true'
    });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
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
      message: error.message
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
      message: error.message
    });
  }
};

// get post by id
export const getPostById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { userEmail } = request.query;
    const result = await postService.getPostById(id, userEmail as string);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// like post
export const likePost = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const result = await postService.likePost(id, request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// like post
export const dislikePost = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const result = await postService.dislikePost(id, request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};
