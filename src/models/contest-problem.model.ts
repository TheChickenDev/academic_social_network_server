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
    sampleCode: {
      type: new Schema(
        {
          javascript: { type: String, required: true },
          python: { type: String, required: true },
          java: { type: String, required: true },
          c: { type: String, required: true },
          cpp: { type: String, required: true }
        },
        { _id: false }
      ),
      required: false
    },
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
