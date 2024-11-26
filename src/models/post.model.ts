import mongoose, { Schema } from 'mongoose';
import { Post, Comment } from '../interfaces/post.interface';

export const commentSchema: Schema<Comment> = new Schema(
  {
    postId: { type: String, required: true },
    ownerId: { type: String, required: true },
    parentId: { type: String, required: false, default: '' },
    content: { type: Schema.Types.Mixed, required: true },
    numberOfLikes: { type: Number, required: true, default: 0 },
    likedBy: { type: [String], required: false, default: [] },
    numberOfDislikes: { type: Number, required: true, default: 0 },
    dislikedBy: { type: [String], required: false, default: [] },
    numberOfRyplies: { type: Number, required: true, default: 0 },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: false, default: [] }]
  },
  { timestamps: true }
);

const postSchema: Schema<Post> = new Schema(
  {
    title: { type: String, required: true },
    tags: { type: [String], required: true, default: [] },
    ownerId: { type: String, required: true, default: '' },
    groupId: { type: String, required: false, default: '' },
    content: { type: Schema.Types.Mixed, required: true },
    numberOfLikes: { type: Number, required: true, default: 0 },
    likedBy: { type: [String], required: false, default: [] },
    numberOfDislikes: { type: Number, required: true, default: 0 },
    dislikedBy: { type: [String], required: false, default: [] },
    numberOfComments: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

const PostModel = mongoose.model<Post>('Post', postSchema);

export default PostModel;

export const CommentModel = mongoose.model<Comment>('Comment', commentSchema);
