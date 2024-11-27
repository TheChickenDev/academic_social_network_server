import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from '../src/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import messageService from './services/message.service';

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

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const userSocketMap = new Map<string, string>();
io.on('connection', (socket) => {
  console.log('a user connected');
  const userEmail = socket.handshake.query.userEmail as string;
  userSocketMap.set(userEmail, socket.id);

  socket.on(
    'chat message',
    async (msg: {
      conversationId: string;
      senderId: string;
      receiverId: string;
      type: 'text' | 'image' | 'video' | 'audio' | 'icon';
      content: string;
    }) => {
      const result = await messageService.createMessage(msg);
      const senderSocketId = userSocketMap.get(msg.senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('chat message', result);
      }
      const receiverSocketId = userSocketMap.get(msg.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('chat message', result);
      }
    }
  );

  socket.on('disconnect', () => {
    console.log('user disconnected');
    userSocketMap.delete(userEmail);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
