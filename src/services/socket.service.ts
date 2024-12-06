import { Server } from 'socket.io';
import messageService from './message.service';

let io: Server | null = null;

const userSocketMap = new Map<string, string>();

export const initializeSocketIO = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
    const userId = socket.handshake.query.userId as string;
    userSocketMap.set(userId, socket.id);

    socket.on(
      'chat message',
      async (msg: {
        conversationId: string;
        senderId: string;
        receiverId: string;
        type: 'text' | 'image' | 'video' | 'audio' | 'icon';
        content: string;
      }) => {
        messageService.createMessage(msg);
      }
    );

    socket.on('disconnect', () => {
      console.log('user disconnected');
      userSocketMap.delete(userId);
    });
  });
};

export const getSocketIO = () => {
  return io;
};

export const getSocketId = (id: string) => {
  return io ? userSocketMap.get(id) : null;
};

export const emitToUser = (socketId: string, event: string, data: any) => {
  io?.to(socketId).emit(event, data);
};
