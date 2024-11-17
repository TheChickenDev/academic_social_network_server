import { Document, ObjectId } from 'mongoose';
import { ImageData } from './utils.interface';

// job
export interface Job extends Document {
  profession: string;
  company: string;
  fromDate: Date;
  toDate: Date;
  untilNow: boolean;
  description: string;
  isPrivate: boolean;
}

// education
export interface Education extends Document {
  schoolName: string;
  fromDate: Date;
  toDate: Date;
  untilNow: boolean;
  isPrivate: boolean;
}

// contact
export interface Contact extends Document {
  phone: string;
  links: string[];
  isPrivate: boolean;
}

// introduction
export interface Introduction extends Document {
  jobs: Job[];
  educations: Education[];
  address: string;
  contact: Contact;
}

// follower
export interface Follower extends Document {
  followerEmail: string;
  followDate: Date;
  followerName: string;
  followerAvatar: ImageData;
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
  avatarImg: ImageData;
  isAdmin: boolean;
  isActive: boolean;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

// user input
export interface CreateUserInput {
  email: string;
  password: string;
  confirmPassword: string;
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
}
