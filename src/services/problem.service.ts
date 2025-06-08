import ContestModel from '../models/contest.model';
import { ContestProblem, ContestSubmission } from '../interfaces/contest.interface';
import ContestProblemModel from '../models/contest-problem.model';
import ContestSubmissionModel from '../models/contest-submission.model';

const createProblem = async (contestData: ContestProblem) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contest = await ContestProblemModel.create(contestData);
      resolve({
        message: 'Problem created successfully!',
        data: contest
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getProblems = async ({
  page,
  limit,
  contestId,
  problemId,
  userId
}: {
  page: number;
  limit: number;
  contestId: string;
  problemId: string;
  userId: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (problemId) {
        const problem = await ContestProblemModel.findById(problemId);
        const submission = await ContestSubmissionModel.find({
          contestId,
          problemId,
          userId
        });

        return resolve({
          message: 'Problem fetched successfully!',
          data: {
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            testCases: problem.testCases,
            sampleCode: problem.sampleCode,
            _id: problem._id,
            isSolved: submission.length > 0,
            submitedCode: submission[0]?.code
          }
        });
      }
      const contests = await ContestProblemModel.find({ contestId }).skip((page - 1) * limit);
      resolve({
        message: 'Problems fetched successfully!',
        data: contests
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateProblem = async (problemId: string, problemData: ContestProblem) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contest = await ContestProblemModel.findByIdAndUpdate(problemId, problemData, { new: true });
      resolve({
        message: 'Problem updated successfully!',
        data: contest
      });
    } catch (error) {
      reject(error);
    }
  });
};

const createSubmission = async (submissionData: ContestSubmission) => {
  return new Promise(async (resolve, reject) => {
    try {
      const submission = await ContestSubmissionModel.create(submissionData);
      ContestModel.findByIdAndUpdate;
      resolve({
        message: 'Submission created successfully!',
        data: submission
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  createProblem,
  getProblems,
  updateProblem,
  createSubmission
};
