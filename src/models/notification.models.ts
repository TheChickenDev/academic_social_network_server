import mongoose, { Model, Schema } from 'mongoose';
import { Notification } from '../interfaces/notification.interface';

const notificationSchema: Schema<Notification> = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'sendFriendRequest',
        'acceptFriendRequest',
        'rejectFriendRequest',
        'unfriend',
        'joinGroup',
        'leaveGroup',
        'createPost',
        'commentPost'
      ]
    },
    groupId: {
      type: String
    },
    userId: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      required: true
    },
    ownerId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

notificationSchema.post('save', async function () {
  console.log('Notification has been saved');
});

const NotificationModel: Model<Notification> = mongoose.model('Notification', notificationSchema);

export default NotificationModel;
