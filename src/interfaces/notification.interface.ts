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
  postId?: string;
  userId: string;
  receiverIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}