import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from '../src/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT as string, 10) || 5000;

app.use(cors());
app.use(
  express.json({
    limit: '50mb'
  })
);
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

routes(app);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Connection successfully!');
  })
  .catch((err: Error) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log('Server is running on port ', port);
});
