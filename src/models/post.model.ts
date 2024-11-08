import mongoose, { Schema } from 'mongoose';
import { Post, Comment, Tag, Reply, ActionInfo } from '../interfaces/post.interface';

export const commentSchema: Schema<Comment> = new Schema(
  {
    postId: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerAvatar: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    numberOfLikes: { type: Number, required: true, default: 0 },
    likes: [
      new Schema<ActionInfo>(
        {
          ownerName: { type: String, required: true },
          ownerEmail: { type: String, required: true }
        },
        {
          _id: false
        }
      )
    ],
    numberOfDislikes: { type: Number, required: true, default: 0 },
    dislikes: [
      new Schema<ActionInfo>(
        {
          ownerName: { type: String, required: true },
          ownerEmail: { type: String, required: true }
        },
        {
          _id: false
        }
      )
    ],
    numberOfRyplies: { type: Number, required: true, default: 0 },
    replies: [
      new Schema<Reply>(
        {
          postId: { type: String, required: true },
          commentId: { type: String, required: true },
          ownerName: { type: String, required: true },
          ownerAvatar: { type: String, required: true },
          ownerEmail: { type: String, required: true },
          content: { type: Schema.Types.Mixed, required: true },
          numberOfLikes: { type: Number, required: true, default: 0 },
          likes: [
            new Schema<ActionInfo>(
              {
                ownerName: { type: String, required: true },
                ownerEmail: { type: String, required: true }
              },
              {
                _id: false
              }
            )
          ],
          numberOfDislikes: { type: Number, required: true, default: 0 },
          dislikes: [
            new Schema<ActionInfo>(
              {
                ownerName: { type: String, required: true },
                ownerEmail: { type: String, required: true }
              },
              {
                _id: false
              }
            )
          ]
        },
        { timestamps: true }
      )
    ]
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
    tags: { type: [tagSchema], required: false, default: [] },
    ownerName: { type: String, required: true },
    ownerAvatar: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    groupId: { type: String, required: false, default: '' },
    groupName: { type: String, required: false, default: '' },
    content: { type: Schema.Types.Mixed, required: true },
    numberOfLikes: { type: Number, required: true, default: 0 },
    likes: [
      new Schema<ActionInfo>(
        {
          ownerName: { type: String, required: true },
          ownerEmail: { type: String, required: true }
        },
        {
          _id: false
        }
      )
    ],
    dislikes: [
      new Schema<ActionInfo>(
        {
          ownerName: { type: String, required: true },
          ownerEmail: { type: String, required: true }
        },
        {
          _id: false
        }
      )
    ],
    numberOfDislikes: { type: Number, required: true, default: 0 },
    numberOfComments: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

const PostModel = mongoose.model<Post>('Post', postSchema);

export default PostModel;

export const CommentModel = mongoose.model<Comment>('Comment', commentSchema);
