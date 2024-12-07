export interface Notification extends Document {
  _id?: string;
  type:
    | 'sendFriendRequest'
    | 'acceptFriendRequest'
    | 'rejectFriendRequest'
    | 'createPost'
    | 'commentPost'
    | 'replyComment';
  groupId?: string;
  postId?: string;
  userId: string;
  receiverIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
