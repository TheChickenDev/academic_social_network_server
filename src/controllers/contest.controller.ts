import { Request, Response } from 'express';
import contestService from '../services/contest.service';

export const createContest = async (req: Request, res: Response) => {
  try {
    const { title, description, startDate, endDate, problems, createdBy } = req.body;
    const contest = await contestService.createContest({
      title,
      description,
      startDate,
      endDate,
      problems,
      createdBy
    });
    return res.status(201).json(contest);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

export const getContests = async (req: Request, res: Response) => {
  try {
    const { title, startDate, endDate } = req.query;
    const contests = await contestService.getContests({
      title: typeof title === 'string' ? title : undefined,
      startDate: typeof startDate === 'string' ? startDate : undefined,
      endDate: typeof endDate === 'string' ? endDate : undefined
    });
    return res.status(200).json(contests);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

export const updateContest = async (req: Request, res: Response) => {
  try {
    const { _id, title, description, startDate, endDate, problems, createdBy } = req.body;
    const contest = await contestService.updateContest(_id, {
      title,
      description,
      startDate,
      endDate,
      problems,
      createdBy
    });
    return res.status(200).json(contest);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};
