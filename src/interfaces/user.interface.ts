import { Document, ObjectId } from 'mongoose';

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
  _id: string;
  googleId: string;
  username: string;
  password: string;
  fullName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  introduction: Introduction;
  avatarURL: string;
  backgroundURL: string;
  isAdmin: boolean;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

// user input
export interface UserInput extends Document {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  introduction: Introduction;
  avatar: ObjectId;
  background: ObjectId;
}
