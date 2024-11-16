import { ActionInfo, Comment, CommentQuery, Reply } from '../interfaces/post.interface';
import PostModel, { CommentModel } from '../models/post.model';
import { Document } from 'mongoose';

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
      resolve({
        message: 'Comment successful!',
        data: newComment
      });
    } catch (error) {
      reject(error);
    }
  });
};

// reply
const replyComment = (replyData: Reply) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await PostModel.findById(replyData.postId);
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      const comment = await CommentModel.findById(replyData.commentId);
      if (!comment) {
        return reject({ message: 'Comment not found!' });
      }
      const newReply = {
        ...replyData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      comment.replies.push(newReply);
      comment.save();
      post.numberOfComments += 1;
      post.save();
      resolve({
        message: 'Comment successful!',
        data: newReply
      });
    } catch (error) {
      reject(error);
    }
  });
};

// like comment
const likeComment = (commentId: string, parentId: string, actionInfo: ActionInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let comment: Document<unknown, {}, Comment> &
        Comment &
        Required<{
          _id: string;
        }> = null;
      if (parentId) {
        comment = await CommentModel.findById(parentId);
        if (!comment) {
          return reject({ message: 'Comment not found!' });
        }
        let existLikeIndex = -1;
        let newReply = null;
        comment.replies.forEach((reply) => {
          if (reply._id.toString() === commentId) {
            const existDislikeIndex = reply.dislikes.findIndex(
              (dislike) => dislike.ownerEmail === actionInfo.ownerEmail
            );
            if (existDislikeIndex !== -1) {
              return reject({ message: 'You have already disliked this comment!' });
            }
            const existLikeIndex = reply.likes.findIndex((like) => like.ownerEmail === actionInfo.ownerEmail);
            if (existLikeIndex !== -1) {
              reply.likes.splice(existLikeIndex, 1);
              reply.numberOfLikes = reply.likes.length;
            } else {
              reply.likes.push(actionInfo);
              reply.numberOfLikes = reply.likes.length;
            }
            newReply = reply;
          }
        });
        comment.save();
        resolve({
          message: existLikeIndex !== -1 ? 'Comment unliked!' : 'Comment liked!',
          data: newReply
        });
      } else {
        comment = await CommentModel.findById(commentId);

        if (!comment) {
          return reject({ message: 'Comment not found!' });
        }
        const existDislikeIndex = comment.dislikes.findIndex((dislike) => dislike.ownerEmail === actionInfo.ownerEmail);
        if (existDislikeIndex !== -1) {
          return reject({ message: 'You have already disliked this comment!' });
        }
        const existLikeIndex = comment.likes.findIndex((like) => like.ownerEmail === actionInfo.ownerEmail);
        if (existLikeIndex !== -1) {
          comment.likes.splice(existLikeIndex, 1);
          comment.numberOfLikes = comment.likes.length;
          comment.save();
          return resolve({
            message: 'Comment unliked!',
            data: comment
          });
        }
        comment.likes.push(actionInfo);
        comment.numberOfLikes = comment.likes.length;
        comment.save();
        resolve({
          message: 'Comment liked!',
          data: comment
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// dislike comment
const dislikeComment = (commentId: string, parentId: string, actionInfo: ActionInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      let comment: Document<unknown, {}, Comment> &
        Comment &
        Required<{
          _id: string;
        }> = null;
      if (parentId) {
        comment = await CommentModel.findById(parentId);
        if (!comment) {
          return reject({ message: 'Comment not found!' });
        }
        let existDislikeIndex = -1;
        let newReply = null;
        comment.replies.forEach((reply) => {
          if (reply._id.toString() === commentId) {
            const existLikeIndex = reply.likes.findIndex((like) => like.ownerEmail === actionInfo.ownerEmail);
            if (existLikeIndex !== -1) {
              return reject({ message: 'You have already liked this comment!' });
            }
            const existDislikeIndex = reply.dislikes.findIndex(
              (dislike) => dislike.ownerEmail === actionInfo.ownerEmail
            );
            if (existDislikeIndex !== -1) {
              reply.dislikes.splice(existDislikeIndex, 1);
              reply.numberOfDislikes = reply.dislikes.length;
            } else {
              reply.dislikes.push(actionInfo);
              reply.numberOfDislikes = reply.dislikes.length;
            }
            newReply = reply;
          }
        });
        comment.save();
        resolve({
          message: existDislikeIndex !== -1 ? 'Comment unliked!' : 'Comment liked!',
          data: newReply
        });
      } else {
        comment = await CommentModel.findById(commentId);

        if (!comment) {
          return reject({ message: 'Comment not found!' });
        }
        const existLikeIndex = comment.likes.findIndex((like) => like.ownerEmail === actionInfo.ownerEmail);
        if (existLikeIndex !== -1) {
          return reject({ message: 'You have already liked this comment!' });
        }
        const existDislikeIndex = comment.dislikes.findIndex((dislike) => dislike.ownerEmail === actionInfo.ownerEmail);
        if (existDislikeIndex !== -1) {
          comment.dislikes.splice(existDislikeIndex, 1);
          comment.numberOfDislikes = comment.dislikes.length;
          comment.save();
          return resolve({
            message: 'Comment unliked!',
            data: comment
          });
        }
        comment.dislikes.push(actionInfo);
        comment.numberOfDislikes = comment.dislikes.length;
        comment.save();
        resolve({
          message: 'Comment liked!',
          data: comment
        });
      }
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
      const comments = await CommentModel.find({ postId: query.postId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit);
      if (!comments) {
        return reject({ message: 'Comments not found!' });
      }
      resolve({
        message: 'Comments found!',
        data: comments
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default { comment, replyComment, likeComment, dislikeComment, getCommentsByPostId };
