import { ContestProblem } from '../interfaces/contest.interface';
import ContestProblemModel from '../models/contest-problem.model';

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
  problemId
}: {
  page: number;
  limit: number;
  contestId: string;
  problemId: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (problemId) {
        const contest = await ContestProblemModel.findById(problemId);
        return resolve({
          message: 'Problem fetched successfully!',
          data: contest
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

export default {
  createProblem,
  getProblems,
  updateProblem
};
