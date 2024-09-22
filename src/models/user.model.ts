import mongoose, { Schema, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Job, Education, Address, Contact, Introduction, User } from '../interfaces/user.interface';

// job

const jobSchema: Schema<Job> = new Schema({
  profession: { type: String },
  company: { type: String },
  fromDate: { type: Date },
  toDate: { type: mongoose.Schema.Types.Mixed },
  description: { type: String },
  isPrivate: { type: Boolean, default: false }
});

// education

const educationSchema: Schema<Education> = new Schema({
  schoolName: { type: String },
  fromDate: { type: Date },
  toDate: { type: mongoose.Schema.Types.Mixed },
  isPrivate: { type: Boolean, default: false }
});

// address

const addressSchema: Schema<Address> = new Schema({
  country: { type: String },
  province: { type: String },
  district: { type: String },
  street: { type: String },
  zipCode: { type: String },
  isPrivate: { type: Boolean, default: false }
});

// contact

const contactSchema: Schema<Contact> = new Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Invalid email!'
    ]
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    match: [/^0\d{9}$/, 'Invalid phone number!']
  },
  links: { type: [String] },
  isPrivate: { type: Boolean, default: false }
});

// introduction

const introductionSchema: Schema<Introduction> = new Schema({
  jobs: { type: [jobSchema] },
  educations: { type: [educationSchema] },
  address: { type: addressSchema },
  contact: { type: contactSchema }
});

// user

const userSchema: Schema<User> = new mongoose.Schema(
  {
    googleId: { type: String, required: false },
    username: {
      type: String,
      required: [true, 'Username is required!'],
      unique: true,
      minlength: [3, 'Username must be at least 3 characters long!'],
      match: [/^[a-zA-Z0-9]+$/, 'Username can only contain alphanumeric characters!']
    },
    password: {
      type: String,
      required: [true, 'Password is required!']
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required!'],
      trim: true,
      max: [150, 'Full name cannot exceed 150 characters!']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required!'],
      validate: {
        validator: function (value: Date) {
          return value < new Date();
        },
        message: 'Date of birth must be in the past!'
      }
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: [true, 'Gender is required!'] },
    introduction: { type: introductionSchema, required: false, default: {} },
    avatarURL: { type: String, required: false, default: '' },
    backgroundURL: { type: String, required: false, default: '' },
    isAdmin: { type: Boolean, required: false, default: false },
    accessToken: { type: String, required: false, default: '' },
    refreshToken: { type: String, required: false, default: '' }
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator, { message: '{VALUE} is already in use!' });

const UserModel: Model<User> = mongoose.model('User', userSchema);

export default UserModel;
