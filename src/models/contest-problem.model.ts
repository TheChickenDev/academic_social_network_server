import mongoose, { Model, Schema } from 'mongoose';
import { ContestProblem } from '../interfaces/contest.interface';

const contestProblemSchema: Schema<ContestProblem> = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    tags: {
      type: [String],
      required: true
    },
    testCases: [
      {
        input: {
          type: String,
          required: true
        },
        output: {
          type: String,
          required: true
        }
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const ContestProblemModel: Model<ContestProblem> = mongoose.model('Contest Problem', contestProblemSchema);

export default ContestProblemModel;
