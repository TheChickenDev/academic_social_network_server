import mongoose, { Schema, Model } from 'mongoose';
import { ImageData } from '../interfaces/utils.interface';

export const ImageSchema: Schema<ImageData> = new Schema(
  {
    url: { type: String, required: false, default: '' },
    publicId: { type: String, required: false, default: '' }
  },
  { _id: false }
);
