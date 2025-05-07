import { Contest } from '../interfaces/contest.interface';
import ContestModel from '../models/contest.model';

const createContest = async (contestData: Contest) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contest = await ContestModel.create(contestData);
      resolve({
        message: 'Contest created successfully',
        data: contest
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getContests = async ({ title, startDate, endDate }: { title: string; startDate: string; endDate: string }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query: any = {};
      if (title) query.title = { $regex: title, $options: 'i' };
      if (startDate) query.startDate = { $gte: new Date(startDate) };
      if (endDate) query.endDate = { $lte: new Date(endDate) };
      const contests = await ContestModel.find(query);
      resolve({
        message: 'Contests fetched successfully',
        data: contests
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateContest = async (contestId: string, contestData: Contest) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contest = await ContestModel.findByIdAndUpdate(contestId, contestData, { new: true });
      if (!contest) {
        return reject(new Error('Contest not found'));
      }
      resolve({
        message: 'Contest updated successfully',
        data: contest
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  createContest,
  getContests,
  updateContest
};
