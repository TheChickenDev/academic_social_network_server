import { Comment, CommentQuery } from '../interfaces/post.interface';
import PostModel, { CommentModel } from '../models/post.model';
import { Document } from 'mongoose';
import { updateUserRank } from './utils.service';
import { COMMENT_POINT } from '../constants/point';
import UserModel from '../models/user.model';

// comment
const comment = (commentData: Comment) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await PostModel.findById(commentData.postId);
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      const newComment = await CommentModel.create(commentData);
      post.numberOfComments += 1;
      post.save();
      const user = await UserModel.findById(commentData.ownerId).select('fullName avatarImg');
      updateUserRank(COMMENT_POINT, commentData.ownerId);
      updateUserRank(COMMENT_POINT, post.ownerId);
      resolve({
        message: 'Comment successful!',
        data: {
          ...newComment.toObject(),
          ownerName: user.fullName,
          ownerAvatar: user.avatarImg?.url
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// reply
const replyComment = (replyData: Comment) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await PostModel.findById(replyData.postId);
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      const comment = await CommentModel.findById(replyData.parentId);
      if (!comment) {
        return reject({ message: 'Comment not found!' });
      }
      const newReply = await CommentModel.create(replyData);
      await newReply.save();
      comment.replies.push(newReply);
      await comment.save();
      post.numberOfComments += 1;
      await post.save();
      updateUserRank(COMMENT_POINT, replyData.ownerId);
      updateUserRank(COMMENT_POINT, post.ownerId);
      const user = await UserModel.findById(newReply.ownerId).select('fullName avatarImg');
      resolve({
        message: 'Comment successful!',
        data: {
          ...newReply.toObject(),
          ownerName: user.fullName,
          ownerAvatar: user.avatarImg?.url
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// like comment
const likeComment = (commentId: string, userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let comment: Document<unknown, {}, Comment> &
        Comment &
        Required<{
          _id: string;
        }> = null;

      comment = await CommentModel.findById(commentId);

      if (!comment) {
        return reject({ message: 'Comment not found!' });
      }
      const existDislikeIndex = comment.dislikedBy.findIndex((id) => id === userId);
      if (existDislikeIndex !== -1) {
        return reject({ message: 'You have already disliked this comment!' });
      }
      const existLikeIndex = comment.likedBy.findIndex((id) => id === userId);
      if (existLikeIndex !== -1) {
        comment.likedBy.splice(existLikeIndex, 1);
        comment.numberOfLikes = comment.likedBy.length;
        comment.save();
        const likedBy = await Promise.all(
          comment.likedBy.map(async (id) => {
            const likedInfo = await UserModel.findById(id).select('_id fullName');
            return {
              userId: likedInfo._id,
              userName: likedInfo.fullName
            };
          })
        );
        return resolve({
          message: 'Comment unliked!',
          data: {
            numberOfLikes: comment.numberOfLikes,
            likedBy
          }
        });
      }
      comment.likedBy.push(userId);
      comment.numberOfLikes = comment.likedBy.length;
      comment.save();
      const likedBy = await Promise.all(
        comment.likedBy.map(async (id) => {
          const likedInfo = await UserModel.findById(id).select('_id fullName');
          return {
            userId: likedInfo._id,
            userName: likedInfo.fullName
          };
        })
      );
      resolve({
        message: 'Comment liked!',
        data: {
          numberOfLikes: comment.numberOfLikes,
          likedBy
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// dislike comment
const dislikeComment = (commentId: string, userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let comment: Document<unknown, {}, Comment> &
        Comment &
        Required<{
          _id: string;
        }> = null;

      comment = await CommentModel.findById(commentId);

      if (!comment) {
        return reject({ message: 'Comment not found!' });
      }
      const existLikeIndex = comment.likedBy.findIndex((id) => id === userId);
      if (existLikeIndex !== -1) {
        return reject({ message: 'You have already liked this comment!' });
      }
      const existDislikeIndex = comment.dislikedBy.findIndex((id) => id === userId);
      if (existDislikeIndex !== -1) {
        comment.dislikedBy.splice(existDislikeIndex, 1);
        comment.numberOfDislikes = comment.dislikedBy.length;
        comment.save();
        const dislikedBy = await Promise.all(
          comment.dislikedBy.map(async (id) => {
            const dislikedInfo = await UserModel.findById(id).select('_id fullName');
            return {
              userId: dislikedInfo._id,
              userName: dislikedInfo.fullName
            };
          })
        );
        return resolve({
          message: 'Comment unliked!',
          data: {
            numberOfDislikes: comment.numberOfDislikes,
            dislikedBy
          }
        });
      }
      comment.dislikedBy.push(userId);
      comment.numberOfDislikes = comment.dislikedBy.length;
      comment.save();
      const dislikedBy = await Promise.all(
        comment.dislikedBy.map(async (id) => {
          const dislikedInfo = await UserModel.findById(id).select('_id fullName');
          return {
            userId: dislikedInfo._id,
            userName: dislikedInfo.fullName
          };
        })
      );
      resolve({
        message: 'Comment liked!',
        data: {
          numberOfDislikes: comment.numberOfDislikes,
          dislikedBy
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get comments by post id
const getCommentsByPostId = (query: CommentQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (query.page - 1) * query.limit;
      const comments = await CommentModel.find({ postId: query.postId, parentId: '' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit);
      if (!comments) {
        return reject({ message: 'Comments not found!' });
      }
      const result = await Promise.all(
        comments.map(async (comment) => {
          const replies = await CommentModel.find({ parentId: comment._id });
          const likedBy = await Promise.all(
            comment.likedBy.map(async (id) => {
              const likedInfo = await UserModel.findById(id).select('_id fullName');
              return {
                userId: likedInfo._id,
                userName: likedInfo.fullName
              };
            })
          );
          const dislikedBy = await Promise.all(
            comment.dislikedBy.map(async (id) => {
              const dislikedInfo = await UserModel.findById(id).select('_id fullName');
              return {
                userId: dislikedInfo._id,
                userName: dislikedInfo.fullName
              };
            })
          );
          const handledReplies = await Promise.all(
            replies.map(async (reply) => {
              const likedBy = await Promise.all(
                reply.likedBy.map(async (id) => {
                  const likedInfo = await UserModel.findById(id).select('_id fullName');
                  return {
                    userId: likedInfo._id,
                    userName: likedInfo.fullName
                  };
                })
              );
              const dislikedBy = await Promise.all(
                reply.dislikedBy.map(async (id) => {
                  const dislikedInfo = await UserModel.findById(id).select('_id fullName');
                  return {
                    userId: dislikedInfo._id,
                    userName: dislikedInfo.fullName
                  };
                })
              );
              const user = await UserModel.findById(reply.ownerId).select('fullName avatarImg');
              return {
                ...reply.toObject(),
                likedBy,
                dislikedBy,
                ownerName: user.fullName,
                ownerAvatar: user.avatarImg?.url
              };
            })
          );
          const user = await UserModel.findById(comment.ownerId).select('fullName avatarImg');
          return {
            ...comment.toObject(),
            replies: handledReplies,
            likedBy,
            dislikedBy,
            ownerName: user.fullName,
            ownerAvatar: user.avatarImg?.url
          };
        })
      );
      resolve({
        message: 'Comments found!',
        data: result
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default { comment, replyComment, likeComment, dislikeComment, getCommentsByPostId };
