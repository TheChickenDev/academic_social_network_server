import { Document, ObjectId } from 'mongoose';
import { ImageData } from './utils.interface';
import { GroupMember } from './group.interface';

// job
export interface Job extends Document {
  profession: string;
  company: string;
  fromDate: Date;
  toDate: Date | 'until now';
  description: string;
  isPrivate: boolean;
}

// education
export interface Education extends Document {
  schoolName: string;
  fromDate: Date;
  toDate: Date | 'until now';
  isPrivate: boolean;
}

// address
export interface Address extends Document {
  country: string;
  province: string;
  district: string;
  street: string;
  zipCode: string;
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
  address: Address;
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
  followers: Follower[];
  groups: GroupMember[];
  avatarImg: ImageData;
  backgroundImg: ImageData;
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
  cloudinaryUrls: string[];
  publicIds: string[];
}
