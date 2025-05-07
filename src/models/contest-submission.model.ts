import mongoose, { Model, Schema } from 'mongoose';
import { ContestSubmission } from '../interfaces/contest.interface';

const contestSubmissionSchema: Schema<ContestSubmission> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: true
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest Problem',
      required: true
    },
    language: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'wrong answer', 'runtime error', 'compilation error'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const ContestSubmissionModel: Model<ContestSubmission> = mongoose.model('Contest Submission', contestSubmissionSchema);

export default ContestSubmissionModel;
