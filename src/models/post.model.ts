import mongoose, { Schema } from 'mongoose';
import { Post, Comment, Tag, Reply } from '../interfaces/post.interface';

export const replySchema: Schema<Reply> = new Schema(
  {
    postId: { type: String, required: true },
    commentId: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerAvatar: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    content: { type: String, required: true },
    numberOfLikes: { type: Number, required: true, default: 0 },
    numberOfDislikes: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export const commentSchema: Schema<Comment> = new Schema(
  {
    postId: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerAvatar: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    content: { type: String, required: true },
    numberOfLikes: { type: Number, required: true, default: 0 },
    numberOfDislikes: { type: Number, required: true, default: 0 },
    numberOfRyplies: { type: Number, required: true, default: 0 },
    replies: { type: [replySchema], required: false, default: [] }
  },
  { timestamps: true }
);

export const tagSchema: Schema<Tag> = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const postSchema: Schema<Post> = new Schema(
  {
    title: { type: String, required: true },
    tags: { type: [tagSchema], required: true },
    ownerName: { type: String, required: true },
    ownerAvatar: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    groupId: { type: String, required: false, default: '' },
    groupName: { type: String, required: false, default: '' },
    content: { type: Schema.Types.Mixed, required: true },
    numberOfLikes: { type: Number, required: true, default: 0 },
    numberOfDislikes: { type: Number, required: true, default: 0 },
    numberOfComments: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

const PostModel = mongoose.model<Post>('Post', postSchema);

export default PostModel;

export const CommentModel = mongoose.model<Comment>('Comment', commentSchema);

export const ReplyModel = mongoose.model<Reply>('Reply', replySchema);
