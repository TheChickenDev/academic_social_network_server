import { Request, Response } from 'express';
import userService from '../services/user.service';
import { isValidInputPassword } from '../utils/user.utils';
import { v2 as cloudinary } from 'cloudinary';
import { refreshTokenService } from '../services/jwt';

// create user
export const createUser = async (request: Request, response: Response) => {
  try {
    const { password, confirm_password } = request.body;
    if (isValidInputPassword(password) === false) {
      return response.status(400).json({
        message:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character!'
      });
    }
    if (password !== confirm_password) {
      return response.status(400).json({
        message: 'Password and confirm password do not match!'
      });
    }
    const result = await userService.createUser(request.body);
    return response.status(201).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// login
export const login = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;
    const result = await userService.login(email, password);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// login with google
export const loginWithGoogle = async (request: Request, response: Response) => {
  try {
    const result = await userService.loginWithGoogle(request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// forgot password

export const forgotPassword = async (request: Request, response: Response) => {
  try {
    const baseURL = request.headers.referer;
    const result = await userService.forgotPassword({ ...request.body, baseURL });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// reset password

export const resetPassword = async (request: Request, response: Response) => {
  try {
    const { password, confirm_password } = request.body;
    if (isValidInputPassword(password) === false) {
      return response.status(400).json({
        message:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character!'
      });
    }
    if (password !== confirm_password) {
      return response.status(400).json({
        message: 'Password and confirm password do not match!'
      });
    }
    const result = await userService.resetPassword(request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// update user
export const updateUser = async (request: Request, response: Response) => {
  try {
    const result = await userService.updateUser(request.body);
    return response.status(200).json(result);
  } catch (error) {
    if (request.body.publicId) {
      await cloudinary.uploader.destroy(request.body.publicId);
    }
    return response.status(400).json({
      message: error.message
    });
  }
};

// delete user
export const deleteUser = async (request: Request, response: Response) => {
  try {
    const { userId } = request.query;
    const result = await userService.deleteUser(userId as string);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// get user
export const getUser = async (request: Request, response: Response) => {
  try {
    const { userId, page, limit } = request.query;
    if (page || limit) {
      const result = await userService.getUsers({
        userId: userId as string,
        page: parseInt(page as string, 10) ?? 1,
        limit: parseInt(limit as string, 10) ?? 10
      });
      return response.status(200).json(result);
    }
    const result = await userService.getUser({
      userId: userId as string
    });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// friend request controller

export const controlFriendRequest = async (request: Request, response: Response) => {
  try {
    const { action } = request.query;
    if (action === 'add') {
      const result = await userService.addFriend(request.body);
      return response.status(200).json(result);
    } else if (action === 'accept') {
      const result = await userService.acceptFriend(request.body);
      return response.status(200).json(result);
    } else if (action === 'remove') {
      const result = await userService.removeFriend(request.body);
      return response.status(200).json(result);
    }
    return response.status(400).json({
      message: 'Invalid action!'
    });
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// get friends

export const getFriends = async (request: Request, response: Response) => {
  try {
    const { userId, status } = request.query;
    const result = await userService.getFriends({ _id: userId as string, status: status as string });
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// block user
export const blockUser = async (request: Request, response: Response) => {
  try {
    const result = await userService.blockUser(request.body);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};

// refresh token
export const refreshToken = async (request: Request, response: Response) => {
  try {
    const token = (request.headers.refresh_token as string)?.split(' ')[1];
    if (!token) {
      return response.status(200).json({
        status: 'ERR',
        message: 'The token is required'
      });
    }
    const res = await refreshTokenService(token);
    return response.status(200).json(res);
  } catch (error) {
    return response.status(400).json({
      message: error
    });
  }
};

// post request controller

export const controlPostRequest = async (request: Request, response: Response) => {
  try {
    const { action } = request.query;
    if (action === 'save') {
      const result = await userService.savePost(request.body);
      return response.status(200).json(result);
    } else if (action === 'unsave') {
      const result = await userService.unsavePost(request.body);
      return response.status(200).json(result);
    }
    return response.status(400).json({
      message: 'Invalid action!'
    });
  } catch (error) {
    return response.status(400).json({
      message: error.message
    });
  }
};
