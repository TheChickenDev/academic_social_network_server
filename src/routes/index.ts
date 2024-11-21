import { Application } from 'express';
import UserRouter from './user.route';
import PostRouter from './post.route';
import CommentRouter from './comment.route';
import GroupRouter from './group.route';
import ConversationRouter from './conversation.route';
import MessageRouter from './message.route';

const routes = (app: Application) => {
  app.use('/api/users', UserRouter);
  app.use('/api/posts', PostRouter);
  app.use('/api/comments', CommentRouter);
  app.use('/api/groups', GroupRouter);
  app.use('/api/conversations', ConversationRouter);
  app.use('/api/messages', MessageRouter);
};

export default routes;
