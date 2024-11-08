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
const getPosts = (query: PostQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (query.ownerEmail) {
        const posts = await PostModel.find({ ownerEmail: query.ownerEmail });
        if (!posts) {
          return reject({ message: 'Posts not found!' });
        }
        return resolve({
          message: 'Post found!',
          data: posts
        });
      }
      const skip = (query.page - 1) * query.limit;
      const posts = await PostModel.find().sort({ createdAt: -1 }).skip(skip).limit(query.limit);
      resolve({
        message: 'Posts found!',
        data: posts
      });
    } catch (error) {
      reject(error);
    }
  });
};

// update post
const updatePost = (newData: Post) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { _id, ...data } = newData;
      const post = await PostModel.findByIdAndUpdate(_id, data, { new: true });
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      resolve({
        message: 'Post updated!',
        data: post
      });
    } catch (error) {
      reject(error);
    }
  });
};

// update post
const deletePost = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await PostModel.findByIdAndDelete(id);
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      resolve({
        message: 'Post deleted!',
        data: post
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
      resolve({
        message: 'Post found!',
        data: post
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
      const existDislikeIndex = post.dislikes.findIndex((like) => like.ownerEmail === actionInfo.ownerEmail);
      if (existDislikeIndex !== -1) {
        post.dislikes.splice(existDislikeIndex, 1);
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

export default { createPost, getPosts, getPostById, likePost, dislikePost, updatePost, deletePost };
