import UserModel from '../models/user.model';
import { User, CreateUserInput, UpdateUserInput, UserQuery } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwtService from './jwt';
import PostModel from '../models/post.model';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import GroupModel from '../models/group.model';
import NotificationModel from '../models/notification.model';

const transporter = nodemailer.createTransport({
  service: process.env.MY_EMAIL_SERVICE,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_EMAIL_PASSWORD
  }
});

// register
const createUser = (newUserData: CreateUserInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password, fullName } = newUserData;
      const hashPassword = bcrypt.hashSync(password, 12);

      const existEmail = await UserModel.findOne({ email });
      if (existEmail) {
        return reject({
          message: 'Email already exists!'
        });
      }

      const newUser = await UserModel.create({
        email,
        password: hashPassword,
        fullName
      });

      const access_token = await jwtService.generateAccessToken({
        _id: newUser._id.toString(),
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        fullName: newUser.fullName,
        avatar: newUser.avatarImg?.url
      });

      const refresh_token = await jwtService.generateRefreshToken({
        _id: newUser._id.toString(),
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        fullName: newUser.fullName,
        avatar: newUser.avatarImg?.url
      });
      resolve({
        message: 'Create account successful!',
        data: {
          access_token,
          refresh_token
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// login
const login = (email: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return reject({
          message: 'Account does not exist!'
        });
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return reject({
          message: 'Incorrect password!'
        });
      } else {
        const access_token = await jwtService.generateAccessToken({
          _id: user._id.toString(),
          email: user.email,
          isAdmin: user.isAdmin,
          fullName: user.fullName,
          avatar: user.avatarImg?.url
        });
        const refresh_token = await jwtService.generateRefreshToken({
          _id: user._id.toString(),
          email: user.email,
          isAdmin: user.isAdmin,
          fullName: user.fullName,
          avatar: user.avatarImg?.url
        });
        await UserModel.findByIdAndUpdate(user._id, { accessToken: access_token, refreshToken: refresh_token });
        resolve({
          message: 'Login successful!',
          data: {
            access_token,
            refresh_token
          }
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// login with google
const loginWithGoogle = (data: { email: string; name: string; googleId: string; avatar: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await UserModel.findOne({
        $or: [
          {
            googleId: data.googleId
          },
          {
            email: data.email
          }
        ]
      });
      // let user = await UserModel.findOne({ googleId: data.googleId });
      if (!user) {
        const hashPassword = bcrypt.hashSync(data.email + data.googleId, 12);
        user = await UserModel.create({
          googleId: data.googleId,
          email: data.email,
          fullName: data.name,
          password: hashPassword,
          avatarImg: { url: data.avatar, publicId: '' }
        });
      }
      const access_token = await jwtService.generateAccessToken({
        _id: user._id.toString(),
        email: user.email,
        isAdmin: user.isAdmin,
        fullName: user.fullName,
        avatar: user.avatarImg.url
      });
      const refresh_token = await jwtService.generateRefreshToken({
        _id: user._id.toString(),
        email: user.email,
        isAdmin: user.isAdmin,
        fullName: user.fullName,
        avatar: user.avatarImg.url
      });
      await UserModel.findByIdAndUpdate(user._id, { accessToken: access_token, refreshToken: refresh_token });
      resolve({
        message: 'Login successful!',
        data: {
          access_token,
          refresh_token
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// reset password

const forgotPassword = ({ email, baseURL }: { email: string; baseURL: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Find the user by email
      const user = await UserModel.findOne({ email });

      if (!user) {
        return reject({ message: 'No user found' });
      }

      const token = jwt.sign({ id: user._id, email }, process.env.REFRESH_TOKEN ?? '', { expiresIn: '15m' });
      user.resetPasswordToken = token;
      user.resetPasswordExpire = new Date(Date.now() + 900000); // 15 minutes
      await user.save();

      // Send the password reset email
      const resetUrl = `${baseURL}reset-password/${token}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Request',
        html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `
      };

      await transporter.sendMail(mailOptions);
      resolve({ message: 'Password reset email sent' });
    } catch (error) {
      reject(error);
    }
  });
};

// reset password

const resetPassword = async ({ token, password }: { token: string; password: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN ?? '');
      if (typeof decoded === 'string' || !decoded.email) {
        return reject({ message: 'Invalid or expired password reset token' });
      }
      const { email } = decoded;

      const user = await UserModel.findOne({
        email,
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        return reject({ message: 'Invalid or expired password reset token' });
      }

      const hashPassword = bcrypt.hashSync(password, 12);
      user.password = hashPassword;
      user.resetPasswordToken = '';
      user.resetPasswordExpire = new Date(0); // Set to epoch as a placeholder for "no expiration"
      await user.save();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Confirmation',
        html: `
      <p>Your password has been successfully reset. If you did not initiate this request, please contact us immediately.</p>
    `
      };
      await transporter.sendMail(mailOptions);

      const access_token = await jwtService.generateAccessToken({
        _id: user._id.toString(),
        email: user.email,
        isAdmin: user.isAdmin,
        fullName: user.fullName,
        avatar: user.avatarImg.url
      });
      const refresh_token = await jwtService.generateRefreshToken({
        _id: user._id.toString(),
        email: user.email,
        isAdmin: user.isAdmin,
        fullName: user.fullName,
        avatar: user.avatarImg.url
      });

      resolve({ message: 'Password reset successful', data: { access_token, refresh_token } });
    } catch (error) {
      reject(error);
    }
  });
};

// update user
const updateUser = (data: UpdateUserInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { userId, introduction } = data;

      if (introduction) {
        introduction = JSON.parse(introduction as unknown as string);
      }

      if (introduction?.contact?.phone) {
        const user = await UserModel.findOne({ 'introduction.contact.phone': introduction.contact.phone });
        if (user && user._id.toString() !== userId) {
          return reject({
            message: 'Phone number already exists!'
          });
        }
      }

      let newData: {
        fullName: string;
        dateOfBirth: Date;
        gender: string;
        introduction?: object;
        description?: string;
        avatarImg?: object;
      } = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        description: data.description
      };

      if (introduction?.contact || introduction?.address || introduction?.educations || introduction?.jobs) {
        newData = { ...newData, introduction };
      }

      if (data.cloudinaryUrl) {
        newData = { ...newData, avatarImg: { url: data.cloudinaryUrl, publicId: data.publicId } };
      }

      const user = await UserModel.findByIdAndUpdate(userId, newData, { new: true });

      if (!user) {
        return reject({
          message: 'User not found!'
        });
      }

      resolve({
        message: 'Update user successful!',
        data: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          description: user.description,
          introduction: user.introduction,
          points: user.points,
          rank: user.rank,
          avatarImg: user.avatarImg?.url
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// delete user
const deleteUser = (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findByIdAndDelete(userId);
      if (!user) {
        return reject({
          message: 'User not found!'
        });
      }
      for (let i = 0; i < user.friends.length; i++) {
        const friend = await UserModel.findById(user.friends[i].friendId);
        if (!friend) {
          continue;
        }
        friend.friends = friend.friends.filter((f) => f.friendId !== userId);
        friend.save();
      }
      PostModel.deleteMany({ ownerId: userId });
      GroupModel.deleteMany({ ownerId: userId });
      GroupModel.find({ 'members.userId': userId }).then((groups) => {
        groups.forEach((group) => {
          group.members = group.members.filter((member) => member.userId !== userId);
          group.save();
        });
      });
      resolve({
        message: 'Delete user successful!'
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get user
const getUser = ({ userId }: UserQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return reject({
          message: 'User not found!'
        });
      }
      const posts = await PostModel.find({ ownerId: userId });
      resolve({
        message: 'Get user successful!',
        data: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          description: user.description,
          introduction: user.introduction,
          points: user.points,
          rank: user.rank,
          avatarImg: user.avatarImg?.url,
          numberOfPosts: posts?.length ?? 0,
          numberOfFriends: user.friends?.length ?? 0,
          friends: user.friends
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get users

const getUsers = (query: UserQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(query.userId).select('friends');
      const exceptIds = [...(user?.friends.map((f) => f.friendId) ?? []), query?.userId];
      if (query?.limit === 0) {
        const users = await UserModel.find({ _id: { $nin: exceptIds }, isAdmin: false })
          .select('email fullName points rank avatarImg')
          .sort({ createdAt: -1 });
        if (!users) {
          return reject({
            message: 'No user found!'
          });
        }
        return resolve({
          message: 'Get users successful!',
          data: users.map((user) => ({ ...user.toObject(), avatarImg: user.avatarImg?.url ?? null }))
        });
      }
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;
      const skip = (page - 1) * limit;
      const users = await UserModel.find({ _id: { $nin: exceptIds }, isAdmin: false })
        .select('email fullName points rank avatarImg')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      if (!users) {
        return reject({
          message: 'No user found!'
        });
      }
      resolve({
        message: 'Get users successful!',
        data: users.map((user) => ({ ...user.toObject(), avatarImg: user.avatarImg?.url ?? null }))
      });
    } catch (error) {
      reject(error);
    }
  });
};

// add friend

const addFriend = (data: { _id: string; friendId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(data._id);
      if (!user) {
        return reject({
          message: 'User not found!'
        });
      }
      const friend = await UserModel.findById(data.friendId);
      if (!friend) {
        return reject({
          message: 'Friend not found!'
        });
      }
      const isFriend = user.friends?.find((f) => f.friendId === data.friendId);
      if (isFriend) {
        return reject({
          message: 'Friend already exists!'
        });
      }
      user.friends?.push({ friendId: data.friendId, status: 'requested' });
      friend.friends?.push({ friendId: data._id, status: 'pending' });
      await user.save();
      await friend.save();
      NotificationModel.create({
        type: 'sendFriendRequest',
        userId: data._id,
        receiverIds: [data.friendId]
      });
      resolve({
        message: 'Add friend successful!'
      });
    } catch (error) {
      reject(error);
    }
  });
};

// accept friend

const acceptFriend = (data: { _id: string; friendId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(data._id);
      if (!user) {
        return reject({
          message: 'User not found!'
        });
      }
      const friend = await UserModel.findById(data.friendId);
      if (!friend) {
        return reject({
          message: 'Friend not found!'
        });
      }
      const friendIndex = user.friends?.findIndex((f) => f.friendId === data.friendId);
      if (friendIndex === -1) {
        return reject({
          message: 'Friend not found!'
        });
      }
      user.friends[friendIndex].status = 'accepted';
      const friendIndex2 = friend.friends?.findIndex((f) => f.friendId === data._id);
      if (friendIndex2 === -1) {
        return reject({
          message: 'Friend not found!'
        });
      }
      friend.friends[friendIndex2].status = 'accepted';
      await user.save();
      await friend.save();
      NotificationModel.create({
        type: 'acceptFriendRequest',
        userId: data._id,
        receiverIds: [data.friendId]
      });
      resolve({
        message: 'Accept friend successful!'
      });
    } catch (error) {
      reject(error);
    }
  });
};

// remove friend

const removeFriend = (data: { _id: string; friendId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(data._id);
      if (!user) {
        return reject({
          message: 'User not found!'
        });
      }
      const friend = await UserModel.findById(data.friendId);
      if (!friend) {
        return reject({
          message: 'Friend not found!'
        });
      }
      const friendIndex = user.friends?.findIndex((f) => f.friendId === data.friendId);
      if (friendIndex === -1) {
        return reject({
          message: 'Friend not found!'
        });
      }
      user.friends.splice(friendIndex, 1);
      const friendIndex2 = friend.friends?.findIndex((f) => f.friendId === data._id);
      if (friendIndex2 === -1) {
        return reject({
          message: 'Friend not found!'
        });
      }
      friend.friends.splice(friendIndex2, 1);
      await user.save();
      await friend.save();
      NotificationModel.create({
        type: 'rejectFriendRequest',
        userId: data._id,
        receiverIds: [data.friendId]
      });
      resolve({
        message: 'Remove friend successful!'
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get friends

const getFriends = (data: { _id: string; status: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(data._id);
      if (!user) {
        reject({
          message: 'User not found!'
        });
      }
      const result = await UserModel.find({
        _id: { $in: user?.friends.filter((f) => f.status === data.status).map((f) => f.friendId) }
      }).select('_id fullName points rank avatarImg');

      resolve({
        message: 'Get friends successful!',
        data: result.map((user) => ({ ...user.toObject(), avatarImg: user.avatarImg?.url ?? null }))
      });
    } catch (error) {
      reject(error);
    }
  });
};

// block user

const blockUser = (data: { email: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findOne({ email: data.email });
      if (!user) {
        return reject({
          message: 'User not found!'
        });
      }
      user.isActive = false;
      await user.save();
      resolve({
        message: 'Block user successful!',
        data: user
      });
    } catch (error) {
      reject(error);
    }
  });
};

// save post

const savePost = ({ userId, postId }: { userId: string; postId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return reject({ message: 'User not found!' });
      }
      user.savedPosts.push(postId);
      user.save();
      resolve({
        message: 'Post saved!'
      });
    } catch (error) {
      reject(error);
    }
  });
};

// unsave post

const unsavePost = ({ userId, postId }: { userId: string; postId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return reject({ message: 'User not found!' });
      }
      const index = user.savedPosts.findIndex((id) => id === postId);
      if (index === -1) {
        return reject({ message: 'Post not found!' });
      }
      user.savedPosts.splice(index, 1);
      user.save();
      resolve({
        message: 'Post saved!'
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  createUser,
  login,
  loginWithGoogle,
  forgotPassword,
  resetPassword,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  addFriend,
  getFriends,
  acceptFriend,
  removeFriend,
  blockUser,
  savePost,
  unsavePost
};
