import UserModel from '../models/user.model';
import { User, CreateUserInput, UpdateUserInput, UserQuery } from '../interfaces/user.interface';
import bcrypt from 'bcrypt';
import jwtService from './jwt';
import PostModel from '../models/post.model';

// register
const createUser = (newUserData: CreateUserInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = newUserData;
      const hashPassword = bcrypt.hashSync(password, 12);

      const existEmail = await UserModel.findOne({ email });
      if (existEmail) {
        reject({
          message: 'Email already exists!'
        });
      }

      const newUser = await UserModel.create({
        email,
        password: hashPassword
      });
      resolve({
        message: 'Create account successful!',
        data: newUser
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
      const user: User = await UserModel.findOne({ email });
      if (!user) {
        resolve({
          message: 'Account does not exist!'
        });
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        resolve({
          message: 'Incorrect password!'
        });
      } else {
        const access_token = await jwtService.generateAccessToken({
          email: user.email,
          isAdmin: user.isAdmin,
          fullName: user.fullName,
          avatar: user.avatarImg?.url
        });
        const refresh_token = await jwtService.generateRefreshToken({
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
      let user: User = await UserModel.findOne({
        $or: [
          {
            googleId: data.googleId
          },
          {
            email: data.email
          }
        ]
      });
      // let user: User = await UserModel.findOne({ googleId: data.googleId });
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
        email: user.email,
        isAdmin: user.isAdmin,
        fullName: user.fullName,
        avatar: user.avatarImg.url
      });
      const refresh_token = await jwtService.generateRefreshToken({
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

// update user
const updateUser = (data: UpdateUserInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { email, introduction } = data;

      if (introduction) {
        introduction = JSON.parse(introduction as unknown as string);
      }

      if (introduction?.contact?.phone) {
        const user: User = await UserModel.findOne({ 'introduction.contact.phone': introduction.contact.phone });
        if (user && user.email !== email) {
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

      const user: User = await UserModel.findOneAndUpdate({ email }, newData, { new: true });

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

// get user
const getUser = ({ email, _id }: UserQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user: User = await UserModel.findOne({ email });
      if (!user) {
        return reject({
          message: 'User not found!'
        });
      }
      const posts = await PostModel.find({ ownerEmail: email });
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
      const skip = (query?.page - 1) * query?.limit;
      const user = await UserModel.findOne({ email: query?.email }).select('friends');
      const exceptEmails = [...(user?.friends.map((f) => f.friendEmail) ?? []), query?.email];
      const users = await UserModel.find({ email: { $nin: exceptEmails } })
        .select('email fullName points rank avatarImg')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit);
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

const addFriend = (data: { email: string; friendEmail: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user: User = await UserModel.findOne({ email: data.email });
      if (!user) {
        reject({
          message: 'User not found!'
        });
      }
      const friend: User = await UserModel.findOne({ email: data.friendEmail });
      if (!friend) {
        reject({
          message: 'Friend not found!'
        });
      }
      const isFriend = user.friends?.find((f) => f.friendEmail === data.friendEmail);
      if (isFriend) {
        reject({
          message: 'Friend already exists!'
        });
      }
      user.friends?.push({ friendEmail: data.friendEmail, status: 'requested' });
      friend.friends?.push({ friendEmail: data.email, status: 'pending' });
      await user.save();
      await friend.save();
      resolve({
        message: 'Add friend successful!',
        data: user
      });
    } catch (error) {
      reject(error);
    }
  });
};

// accept friend

const acceptFriend = (data: { email: string; friendEmail: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user: User = await UserModel.findOne({ email: data.email });
      if (!user) {
        reject({
          message: 'User not found!'
        });
      }
      const friend: User = await UserModel.findOne({ email: data.friendEmail });
      if (!friend) {
        reject({
          message: 'Friend not found!'
        });
      }
      const friendIndex = user.friends?.findIndex((f) => f.friendEmail === data.friendEmail);
      if (friendIndex === -1) {
        reject({
          message: 'Friend not found!'
        });
      }
      user.friends[friendIndex].status = 'accepted';
      const friendIndex2 = friend.friends?.findIndex((f) => f.friendEmail === data.email);
      if (friendIndex2 === -1) {
        reject({
          message: 'Friend not found!'
        });
      }
      friend.friends[friendIndex2].status = 'accepted';
      await user.save();
      await friend.save();
      resolve({
        message: 'Accept friend successful!',
        data: user
      });
    } catch (error) {
      reject(error);
    }
  });
};

// remove friend

const removeFriend = (data: { email: string; friendEmail: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user: User = await UserModel.findOne({ email: data.email });
      if (!user) {
        reject({
          message: 'User not found!'
        });
      }
      const friend: User = await UserModel.findOne({ email: data.friendEmail });
      if (!friend) {
        reject({
          message: 'Friend not found!'
        });
      }
      const friendIndex = user.friends?.findIndex((f) => f.friendEmail === data.friendEmail);
      if (friendIndex === -1) {
        reject({
          message: 'Friend not found!'
        });
      }
      user.friends.splice(friendIndex, 1);
      const friendIndex2 = friend.friends?.findIndex((f) => f.friendEmail === data.email);
      if (friendIndex2 === -1) {
        reject({
          message: 'Friend not found!'
        });
      }
      friend.friends.splice(friendIndex2, 1);
      await user.save();
      await friend.save();
      resolve({
        message: 'Remove friend successful!',
        data: user
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get friends

const getFriends = (data: { email: string; status: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user: User = await UserModel.findOne({ email: data.email });
      if (!user) {
        reject({
          message: 'User not found!'
        });
      }
      const result = await UserModel.find({
        email: { $in: user.friends.filter((f) => f.status === data.status).map((f) => f.friendEmail) }
      }).select('email fullName points rank avatarImg');

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
      const user: User = await UserModel.findOne({ email: data.email });
      if (!user) {
        reject({
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

const savePost = ({ ownerEmail, postId }: { ownerEmail: string; postId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findOne({ email: ownerEmail });
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

const unsavePost = ({ ownerEmail, postId }: { ownerEmail: string; postId: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findOne({ email: ownerEmail });
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
  updateUser,
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
