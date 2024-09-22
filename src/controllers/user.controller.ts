import { Request, Response } from 'express';
import userService from '../services/user.service';
import { isValidInputPassword } from '../utils/user.utils';
import { v2 as cloudinary } from 'cloudinary';

// create user
export const createUser = async (request: Request, response: Response) => {
  try {
    const { password, confirmPassword } = request.body;
    if (isValidInputPassword(password) === false) {
      return response.status(400).json({
        message:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character!'
      });
    }
    if (password !== confirmPassword) {
      return response.status(400).json({
        message: 'Password and confirm password do not match!'
      });
    }
    const result = await userService.createUser(request.body);
    return response.status(201).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};

// login
export const login = async (request: Request, response: Response) => {
  try {
    const { username, password } = request.body;
    const result = await userService.login(username, password);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(404).json({
      message: error.message
    });
  }
};

// update user
export const updateUser = async (request: Request, response: Response) => {
  const cloudinaryUrls = request.body.cloudinaryUrls;
  const publicIds = request.body.publicIds;
  try {
    const result = await userService.updateUser(request.body, cloudinaryUrls, publicIds);
    return response.status(201).json(result);
  } catch (error) {
    if (publicIds && publicIds.length > 0) {
      for (const publicId of publicIds) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
    return response.status(404).json({
      message: error.message
    });
  }
};
