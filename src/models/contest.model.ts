import mongoose, { Model, Schema } from 'mongoose';
import { Contest } from '../interfaces/contest.interface';

const contestSchema: Schema<Contest> = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    problems: [
      {
        problemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Contest Problem',
          required: true
        },
        score: {
          type: Number,
          required: true
        },
        order: {
          type: Number,
          required: true
        }
      }
    ],
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        score: {
          type: Number,
          default: 0
        }
      }
    ],
    hidden: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const ContestModel: Model<Contest> = mongoose.model('Contest', contestSchema);

export default ContestModel;
