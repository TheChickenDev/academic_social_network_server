import { Application } from 'express';
import UserRouter from './user.route';
import PostRouter from './post.route';
import CommentRouter from './comment.route';
import GroupRouter from './group.route';
import ConversationRouter from './conversation.route';
import MessageRouter from './message.route';
import NotificationRouter from './notification.route';
import ContestRouter from './contest.route';
import ProblemRouter from './problem.route';
import UtilsRouter from './utils.route';

const routes = (app: Application) => {
  app.use('/api/users', UserRouter);
  app.use('/api/posts', PostRouter);
  app.use('/api/comments', CommentRouter);
  app.use('/api/groups', GroupRouter);
  app.use('/api/conversations', ConversationRouter);
  app.use('/api/messages', MessageRouter);
  app.use('/api/notifications', NotificationRouter);
  app.use('/api/contests', ContestRouter);
  app.use('/api/problems', ProblemRouter);
  app.use('/api', UtilsRouter);
};

export default routes;
