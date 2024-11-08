import { Application } from 'express';
import UserRouter from './user.route';
import PostRouter from './post.route';
import CommentRouter from './comment.route';
import GroupRouter from './group.route';

const routes = (app: Application) => {
  app.use('/api/users', UserRouter);
  app.use('/api/posts', PostRouter);
  app.use('/api/comments', CommentRouter);
  app.use('/api/groups', GroupRouter);
};

export default routes;
