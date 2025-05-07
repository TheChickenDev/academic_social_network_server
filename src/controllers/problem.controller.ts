import { Request, Response } from 'express';
import problemService from '../services/problem.service';

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
    const { page = 1, limit = 1000, contestId, problemId } = req.query;
    const problems = await problemService.getProblems({
      page: parseInt(page as string, 10) ?? 1,
      limit: parseInt(limit as string, 10) ?? 10,
      contestId: typeof contestId === 'string' ? contestId : undefined,
      problemId: typeof problemId === 'string' ? problemId : undefined
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
    const { _id, title, description, difficulty, createdBy, testCases } = req.body;
    const contest = await problemService.updateProblem(_id, {
      title,
      description,
      difficulty,
      createdBy,
      testCases
    });
    return res.status(200).json(contest);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};
