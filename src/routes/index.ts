import { Application } from 'express';
import UserRouter from './user.route';

const routes = (app: Application) => {
  app.use('/api/user', UserRouter);
  // app.use("/api/product", ProductRouter);
  // app.use("/api/order", OrderRouter);
};

export default routes;
