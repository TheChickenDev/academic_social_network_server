export interface Notification extends Document {
  _id?: string;
  type:
    | 'sendFriendRequest'
    | 'acceptFriendRequest'
    | 'rejectFriendRequest'
    | 'unfriend'
    | 'joinGroup'
    | 'leaveGroup'
    | 'createPost'
    | 'commentPost';
  groupId?: string;
  userId: string;
  isRead: boolean;
  ownerId: string;
}
