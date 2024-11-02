import { Comment, Reply } from '../interfaces/post.interface';
import PostModel, { CommentModel, ReplyModel } from '../models/post.model';

// comment
const comment = (commentData: Comment) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await PostModel.findById(commentData.postId);
      if (!post) {
        reject({ message: 'Post not found!' });
      }
      const newComment = await CommentModel.create(commentData);
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
      const comment = await CommentModel.findById(replyData.commentId);
      if (!comment) {
        reject({ message: 'Comment not found!' });
      }
      const newComment = await ReplyModel.create(replyData);
      comment.replies.push(newComment);
      comment.save();
      resolve({
        message: 'Comment successful!',
        data: newComment
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default { comment, replyComment };
