import mongoose, { Model, Schema } from 'mongoose';
import { ContestSubmission } from '../interfaces/contest.interface';

const contestSubmissionSchema: Schema<ContestSubmission> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest Problem',
      required: true
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: true
    },
    language: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const ContestSubmissionModel: Model<ContestSubmission> = mongoose.model('Contest Submission', contestSubmissionSchema);

export default ContestSubmissionModel;
