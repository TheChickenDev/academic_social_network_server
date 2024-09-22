import { Document, ObjectId } from 'mongoose';
import { ImageData } from './utils.interface';

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
  email: string;
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

// user
export interface User extends Document {
  googleId: string;
  username: string;
  password: string;
  fullName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other' | '';
  introduction: Introduction;
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
  username: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateUserInput {
  username: string;
  fullName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other' | '';
  introduction: Introduction;
}
