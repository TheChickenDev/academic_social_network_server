import { Request, Response } from 'express';
import postService from '../services/post.service';
import { v2 as cloudinary } from 'cloudinary';

// create post
export const createPost = async (request: Request, response: Response) => {
  try {
    const result = await postService.createPost(request.body);
    return response.status(201).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};

// get posts
export const getPosts = async (request: Request, response: Response) => {
  try {
    const result = await postService.getPosts(request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};

// get post by id
export const getPostById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const result = await postService.getPostById(id);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};
