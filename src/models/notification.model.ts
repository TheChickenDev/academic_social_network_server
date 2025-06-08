import mongoose, { Model, Schema } from 'mongoose';
import { Notification } from '../interfaces/notification.interface';
import { getSocketIO, getSocketId } from '../services/socket.service';
import UserModel from './user.model';
import GroupModel from './group.model';
import { getRelativeTime } from '../utils/time.utils';

const notificationSchema: Schema<Notification> = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'sendFriendRequest',
        'acceptFriendRequest',
        'rejectFriendRequest',
        'createPost',
        'commentPost',
        'replyComment'
      ]
    },
    groupId: {
      type: String,
      required: false
    },
    postId: {
      type: String,
      required: false
    },
    userId: {
      type: String,
      required: true
    },
    receiverIds: {
      type: [String],
      required: true,
      default: []
    }
  },
  { timestamps: true }
);

notificationSchema.post('save', async function (doc) {
  console.log('-------------- Notification Created --------------');
  const io = getSocketIO();

  const userName = await UserModel.findById(doc.userId).select('fullName avatarImg').lean().exec();
  const groupName = await GroupModel.findById(doc.groupId).select('name').lean().exec();

  doc?.receiverIds?.forEach((userId) => {
    const socketId = getSocketId(userId);
    console.log('--------------', socketId);

    if (socketId) {
      io?.to(socketId).emit('notify', {
        ...doc.toObject(),
        userName: userName?.fullName,
        avatarImg: userName?.avatarImg?.url,
        groupName: groupName?.name,
        time: doc.createdAt ? getRelativeTime(doc.createdAt) : ''
      });
    }
  });
});

const NotificationModel: Model<Notification> = mongoose.model('Notification', notificationSchema);

export default NotificationModel;
