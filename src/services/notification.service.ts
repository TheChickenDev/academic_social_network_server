import UserModel from '../models/user.model';
import { Notification } from '../interfaces/notification.interface';
import NotificationModel from '../models/notification.model';
import GroupModel from '../models/group.model';
import { getRelativeTime } from '../utils/time.utils';

// create notification

export const createNotification = (notification: Notification) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newNotification = await NotificationModel.create(notification);
      return resolve({
        message: 'Notification created successfully!',
        data: newNotification
      });
    } catch (error) {
      throw new Error(error);
    }
  });
};

// get notifications

export const getNotifications = async ({ userId, page, limit }: { userId: string; page: number; limit: number }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const notifications = await NotificationModel.find({ receiverIds: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      return resolve({
        message: 'Notifications found successfully!',
        data: await Promise.all(
          notifications.map(async (notification) => {
            const userName = await UserModel.findById(notification.userId).select('fullName avatarImg').lean().exec();
            const groupName = await GroupModel.findById(notification.groupId).select('name').lean().exec();
            return {
              ...notification.toObject(),
              userName: userName?.fullName,
              avatarImg: userName?.avatarImg?.url,
              groupName: groupName?.name,
              time: getRelativeTime(notification.createdAt)
            };
          })
        )
      });
    } catch (error) {
      throw new Error(error);
    }
  });
};
