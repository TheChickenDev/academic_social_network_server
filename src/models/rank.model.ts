import mongoose, { Model, Schema } from 'mongoose';
import { Rank } from '../interfaces/rank.interface';

const rankSchema: Schema<Rank> = new Schema(
  {
    name: { type: String, required: true },
    point: { type: Number, min: 0, max: 9999999, required: true },
    order: { type: Number, min: 0, max: 99, required: true, unique: true }
  },
  { timestamps: true }
);

const RankModel: Model<Rank> = mongoose.model('Rank', rankSchema);

export default RankModel;
