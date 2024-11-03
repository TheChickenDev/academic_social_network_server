import { ActionInfo, Post, PostQuery } from '../interfaces/post.interface';
import PostModel, { CommentModel } from '../models/post.model';

// create post
const createPost = (newPostData: Post) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newPost = await PostModel.create(newPostData);
      resolve({
        message: 'Post successful!',
        data: newPost
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get posts
const getPosts = (params: PostQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (params._id) {
        const post = await PostModel.findById(params._id);
        if (!post) {
          return reject({ message: 'Post not found!' });
        }
        return resolve({
          message: 'Post found!',
          data: post
        });
      }
      const posts = await PostModel.find();
      resolve({
        message: 'Posts found!',
        data: posts
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get post by id
const getPostById = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await PostModel.findById(id);
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      const comments = await CommentModel.find({ postId: id });
      resolve({
        message: 'Post found!',
        data: {
          _id: post._id,
          title: post.title,
          content: post.content,
          tags: post.tags,
          ownerName: post.ownerName,
          ownerAvatar: post.ownerAvatar,
          ownerEmail: post.ownerEmail,
          numberOfComments: post.numberOfComments,
          numberOfLikes: post.numberOfLikes,
          numberOfDislikes: post.numberOfDislikes,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          comments
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// like post
const likePost = (postId: string, actionInfo: ActionInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      const existLikeIndex = post.likes.findIndex((like) => like.ownerEmail === actionInfo.ownerEmail);
      if (existLikeIndex !== -1) {
        post.likes.splice(existLikeIndex, 1);
        post.numberOfLikes = post.likes.length;
        post.save();
        return resolve({
          message: 'Post unliked!',
          data: post
        });
      }
      post.likes.push(actionInfo);
      post.numberOfLikes = post.likes.length;
      post.save();
      resolve({
        message: 'Post liked!',
        data: post
      });
    } catch (error) {
      reject(error);
    }
  });
};

// dislike post
const dislikePost = (postId: string, actionInfo: ActionInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      const existLikeIndex = post.dislikes.findIndex((like) => like.ownerEmail === actionInfo.ownerEmail);
      if (existLikeIndex !== -1) {
        post.dislikes.splice(existLikeIndex, 1);
        post.numberOfDislikes = post.dislikes.length;
        post.save();
        return resolve({
          message: 'Post undisliked!',
          data: post
        });
      }
      post.dislikes.push(actionInfo);
      post.numberOfDislikes = post.dislikes.length;
      post.save();
      resolve({
        message: 'Post disliked!',
        data: post
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default { createPost, getPosts, getPostById, likePost, dislikePost };
