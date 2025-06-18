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
    const userId = socket.handshake.query.userId as string;
    console.log(`a user connected: ${userId}`);
    userSocketMap.set(userId, socket.id);

    socket.on(
      'chat message',
      async (msg: {
        conversationId: string;
        senderId: string;
        receiverId: string;
        type: 'text' | 'call' | 'missed-call';
        content: string;
      }) => {
        messageService.createMessage(msg);
      }
    );

    socket.on(
      'video call',
      (data: {
        conversationId: string;
        senderId: string;
        isVideoCall: boolean;
        receiverId: string;
        receiverName: string;
        receiverAvatar: string;
        stream?: MediaStream;
      }) => {
        const socketId = getSocketId(data?.receiverId);
        if (socketId) {
          io?.to(socketId).emit('incoming call', data);
        }
      }
    );

    socket.on('signal', (data: { signal: any; from: string; to: string }) => {
      const socketId = getSocketId(data?.to);
      if (socketId) {
        io?.to(socketId).emit('signal', data);
      }
    });

    socket.on('reject call', (data: { senderId: string; receiverId: string }) => {
      const socketId = getSocketId(data?.receiverId);
      if (socketId) {
        io?.to(socketId).emit('reject call', data);
      }
    });

    socket.on('disconnect', () => {
      console.log(`user disconnected: ${userId}`);
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
