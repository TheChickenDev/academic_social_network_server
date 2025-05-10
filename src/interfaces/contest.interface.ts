import { ObjectId } from 'mongoose';

export interface Contest {
  _id?: ObjectId;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  problems: [
    {
      problemId: ObjectId;
      score: number;
      order: number;
    }
  ];
  participants?: [
    {
      userId: ObjectId;
      score: number;
    }
  ];
  hidden?: boolean;
  createdBy: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContestProblem {
  _id?: ObjectId;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  testCases?: [
    {
      input: string;
      output: string;
    }
  ];
  sampleCode?: {
    javascript: string;
    python: string;
    java: string;
    c: string;
    cpp: string;
  };
  createdBy: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContestSubmission {
  _id?: ObjectId;
  userId: ObjectId;
  problemId: ObjectId;
  language: string;
  code: string;
  status?: 'pending' | 'accepted' | 'wrong answer' | 'runtime error' | 'compilation error';
  createdAt?: Date;
  updatedAt?: Date;
}
