import { Document, ObjectId } from 'mongoose';
import { ImageData } from './utils.interface';

// job
export interface Job {
  profession: string;
  company: string;
  fromDate: Date;
  toDate: Date;
  untilNow: boolean;
  description: string;
  isPrivate: boolean;
}

// education
export interface Education {
  schoolName: string;
  fromDate: Date;
  toDate: Date;
  untilNow: boolean;
  isPrivate: boolean;
}

// contact
export interface Contact {
  phone: string;
  links: string[];
  isPrivate: boolean;
}

// introduction
export interface Introduction {
  jobs: Job[];
  educations: Education[];
  address: string;
  contact: Contact;
}

// friend

export interface Friend {
  friendEmail: string;
  status: 'requested' | 'pending' | 'accepted' | 'blocked';
  createdAt?: Date;
  updatedAt?: Date;
}

// notification

export interface Notification {
  userEmail: string;
  groupId: string;
  type: 'friend' | 'post' | 'postInGroup' | 'comment';
  content: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// user
export interface User extends Document {
  _id: ObjectId;
  googleId: string;
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other' | '';
  introduction: Introduction;
  description: string;
  points: number;
  rank: string;
  savedPosts: string[];
  friends: Friend[];
  notifications: Notification[];
  avatarImg: ImageData;
  isAdmin: boolean;
  isActive: boolean;
  accessToken: string;
  refreshToken: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  createdAt: Date;
  updatedAt: Date;
}

// user input
export interface CreateUserInput {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface UpdateUserInput {
  email: string;
  fullName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other' | '';
  introduction: Introduction;
  description: string;
  cloudinaryUrl: string;
  publicId: string;
}

export interface UserQuery {
  email: string;
  _id?: string;
  page?: number;
  limit?: number;
}
