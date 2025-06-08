import { Request, Response } from 'express';
import problemService from '../services/problem.service';
import ContestModel from '../models/contest.model';

export const createProblem = async (req: Request, res: Response) => {
  try {
    const { title, description, difficulty, testCases, createdBy } = req.body;
    const contest = await problemService.createProblem({
      title,
      description,
      difficulty,
      createdBy
    });
    return res.status(201).json(contest);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

export const getProblems = async (req: Request, res: Response) => {
  try {
    const { page, limit, contestId, problemId, userId } = req.query;
    const problems = await problemService.getProblems({
      page: parseInt(page as string, 10) ?? 1,
      limit: parseInt(limit as string, 10) ?? 100,
      contestId: typeof contestId === 'string' ? contestId : undefined,
      problemId: typeof problemId === 'string' ? problemId : undefined,
      userId: typeof userId === 'string' ? userId : undefined
    });
    return res.status(200).json(problems);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

export const updateProblem = async (req: Request, res: Response) => {
  try {
    const { _id, title, description, difficulty, createdBy, testCases, sampleCode } = req.body;
    const contest = await problemService.updateProblem(_id, {
      title,
      description,
      difficulty,
      createdBy,
      testCases,
      sampleCode
    });
    return res.status(200).json(contest);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { userId, problemId, contestId, code, language } = req.body;

    const isParticipated = await ContestModel.findOne({
      _id: contestId,
      'participants.userId': userId
    });

    if (isParticipated) {
      await ContestModel.updateOne(
        {
          _id: contestId,
          'participants.userId': userId
        },
        {
          $inc: {
            'participants.$.score': 1
          }
        }
      );
    } else {
      await ContestModel.updateOne(
        { _id: contestId },
        {
          $push: {
            participants: {
              userId,
              score: 1
            }
          }
        }
      );
    }

    const contestSubminssion = await problemService.createSubmission({
      userId,
      problemId,
      contestId,
      code,
      language
    });
    return res.status(201).json(contestSubminssion);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};
