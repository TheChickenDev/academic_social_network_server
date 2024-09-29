import mongoose, { Schema, Model } from 'mongoose';
import { Job, Education, Address, Contact, Introduction, User, Follower } from '../interfaces/user.interface';
import { ImageSchema } from './utils.model';
import { groupMemberSchema } from './group.model';

// job

const jobSchema: Schema<Job> = new Schema(
  {
    profession: { type: String },
    company: { type: String },
    fromDate: { type: Date },
    toDate: { type: mongoose.Schema.Types.Mixed },
    description: { type: String },
    isPrivate: { type: Boolean, default: false }
  },
  { _id: false }
);

// education

const educationSchema: Schema<Education> = new Schema(
  {
    schoolName: { type: String },
    fromDate: { type: Date },
    toDate: { type: mongoose.Schema.Types.Mixed },
    isPrivate: { type: Boolean, default: false }
  },
  { _id: false }
);

// address

const addressSchema: Schema<Address> = new Schema(
  {
    country: { type: String },
    province: { type: String },
    district: { type: String },
    street: { type: String },
    zipCode: { type: String },
    isPrivate: { type: Boolean, default: false }
  },
  { _id: false }
);

// contact

const contactSchema: Schema<Contact> = new Schema(
  {
    email: {
      type: String,
      required: false,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Invalid email!'
      ]
    },
    phone: {
      type: String,
      required: false,
      match: [/^0\d{9}$/, 'Invalid phone number!']
    },
    links: { type: [String] },
    isPrivate: { type: Boolean, default: false }
  },
  { _id: false }
);

// introduction

const introductionSchema: Schema<Introduction> = new Schema(
  {
    jobs: { type: [jobSchema] },
    educations: { type: [educationSchema] },
    address: { type: addressSchema },
    contact: { type: contactSchema }
  },
  { _id: false }
);

// followers

const followersSchema: Schema<Follower> = new Schema(
  {
    followerUsername: { type: String },
    followDate: { type: Date },
    followerName: { type: String },
    followerAvatar: { type: ImageSchema }
  },
  { _id: false }
);

// user

const userSchema: Schema<User> = new mongoose.Schema(
  {
    googleId: { type: String, required: false, default: null },
    username: {
      type: String,
      required: [true, 'Username is required!'],
      unique: true,
      minlength: [6, 'Username must be at least 6 characters long!'],
      maxlength: [150, 'Username cannot exceed 150 characters!'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores!']
    },
    password: {
      type: String,
      required: [true, 'Password is required!']
    },
    fullName: {
      type: String,
      trim: true,
      max: [150, 'Full name cannot exceed 150 characters!'],
      default: null
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return value < new Date();
        },
        message: 'Date of birth must be in the past!'
      },
      default: null
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    introduction: { type: introductionSchema, required: false, default: null },
    followers: { type: [followersSchema], required: false, default: [] },
    groups: { type: [groupMemberSchema], required: false, default: [] },
    avatarImg: { type: ImageSchema, required: false, default: null },
    backgroundImg: { type: ImageSchema, required: false, default: null },
    isAdmin: { type: Boolean, required: false, default: false },
    isActive: { type: Boolean, required: false, default: true },
    accessToken: { type: String, required: false, default: null },
    refreshToken: { type: String, required: false, default: null }
  },
  { timestamps: true }
);

const UserModel: Model<User> = mongoose.model('User', userSchema);

export default UserModel;

export const FollowerModel: Model<Follower> = mongoose.model('Follower', followersSchema);
