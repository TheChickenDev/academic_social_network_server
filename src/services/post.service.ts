import { Post, PostQuery } from '../interfaces/post.interface';
import UserModel from '../models/user.model';
import PostModel from '../models/post.model';
import GroupModel from '../models/group.model';
import { DISLIKE_POINT, LIKE_POINT, POST_POINT } from '../constants/point';
import { updateUserRank } from './utils.service';

// create post
const createPost = (newPostData: Post) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newPost = await PostModel.create(newPostData);
      if (newPost.groupId) {
        const group = await GroupModel.findOne({ _id: newPost.groupId });
        if (!group) {
          return reject({ message: 'Group not found!' });
        }
        if (group.isPrivate) {
          group.posts.push({ postId: newPost._id, status: 'pending' });
          await group.save();
        } else {
          group.posts.push({ postId: newPost._id, status: 'approved' });
          await group.save();
        }
      }
      updateUserRank(POST_POINT, newPost.ownerId);
      resolve({
        message: 'Post successful!',
        data: newPost
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get random posts
const getRandomPosts = (query: PostQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (query.page - 1) * query.limit;
      const posts = await PostModel.find({ groupId: '' }).sort({ createdAt: -1 }).skip(skip).limit(query.limit);
      if (!posts) {
        return reject({ message: 'Posts not found!' });
      }
      const user = await UserModel.findById(query.userId).select('savedPosts');
      resolve({
        message: 'Posts found!',
        data: await Promise.all(
          posts.map(async (post) => {
            const owner = await UserModel.findById(post.ownerId).select('fullName avatarImg');
            const likedBy = await Promise.all(
              post.likedBy.map(async (id) => {
                const likedInfo = await UserModel.findById(id).select('_id fullName');
                return {
                  userId: likedInfo?._id,
                  userName: likedInfo?.fullName
                };
              })
            );
            const dislikedBy = await Promise.all(
              post.dislikedBy.map(async (id) => {
                const dislikedInfo = await UserModel.findById(id).select('_id fullName');
                return {
                  userId: dislikedInfo?._id,
                  userName: dislikedInfo?.fullName
                };
              })
            );
            return {
              ...post.toObject(),
              ownerName: owner?.fullName,
              ownerAvatar: owner?.avatarImg?.url,
              likedBy,
              dislikedBy,
              isSaved: user?.savedPosts?.includes(post._id) ?? false
            };
          })
        )
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get own posts
const getOwnPosts = (query: PostQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (query.page - 1) * query.limit;
      const posts = await PostModel.find({ ownerId: query.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit);
      if (!posts) {
        return reject({ message: 'Posts not found!' });
      }
      const user = await UserModel.findById(query.userId).select('savedPosts');
      resolve({
        message: 'Posts found!',
        data: posts.map((post) => ({
          ...post.toObject(),
          isSaved: user?.savedPosts?.includes(post._id) ?? false
        }))
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get saved posts
const getSavedPosts = (query: PostQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (query.page - 1) * query.limit;
      const user = await UserModel.findById(query.userId).select('savedPosts');
      const posts = await PostModel.find({ _id: { $in: user?.savedPosts } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit);
      if (!posts) {
        return reject({ message: 'Posts not found!' });
      }
      resolve({
        message: 'Posts found!',
        data: posts
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get group posts
const getGroupPosts = (query: PostQuery) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (query.page - 1) * query.limit;
      const group = await GroupModel.findOne({ _id: query.groupId });
      if (!group) {
        return reject({ message: 'Group not found!' });
      }
      const filteredPosts = group.posts.filter((post) => post.status === 'approved');
      const posts = await PostModel.find({ _id: { $in: filteredPosts.map((post) => post.postId) } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit);
      const user = await UserModel.findById(query.userId).select('savedPosts');
      if (!posts) {
        return reject({ message: 'Posts not found!' });
      }
      resolve({
        message: 'Posts found!',
        data: posts.map((post) => ({
          ...post.toObject(),
          isSaved: user?.savedPosts?.includes(post._id) ?? false
        }))
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
      if (post.groupId) {
        const group = await GroupModel.findOne({ _id: post.groupId });
        if (!group) {
          return reject({ message: 'Group not found!' });
        }
        group.posts = group.posts.filter((post) => post.postId !== id);
        await group.save();
      }
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      updateUserRank(-POST_POINT, post.ownerId);
      resolve({
        message: 'Post deleted!'
      });
    } catch (error) {
      reject(error);
    }
  });
};

// get post by id
const getPostById = (id: string, userEmail: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await PostModel.findById(id);
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      const user = await UserModel.findOne({ email: userEmail }).select('fullName avatarImg savedPosts');
      const likedBy = await Promise.all(
        post.likedBy.map(async (id) => {
          const likedInfo = await UserModel.findById(id).select('_id fullName');
          return {
            userId: likedInfo?._id,
            userName: likedInfo?.fullName
          };
        })
      );
      const dislikedBy = await Promise.all(
        post.dislikedBy.map(async (id) => {
          const dislikedInfo = await UserModel.findById(id).select('_id fullName');
          return {
            userId: dislikedInfo?._id,
            userName: dislikedInfo?.fullName
          };
        })
      );
      resolve({
        message: 'Post found!',
        data: {
          ...post?.toObject(),
          ownerName: user?.fullName,
          ownerAvatar: user?.avatarImg?.url,
          likedBy,
          dislikedBy,
          isSaved: user?.savedPosts?.includes(post._id) ?? false
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// like post
const likePost = (postId: string, userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      const existDislikeIndex = post.dislikedBy.findIndex((id) => id === userId);
      if (existDislikeIndex !== -1) {
        return reject({ message: 'You have already disliked this post!' });
      }
      const existLikeIndex = post.likedBy.findIndex((id) => id === userId);
      if (existLikeIndex !== -1) {
        post.likedBy.splice(existLikeIndex, 1);
        const likedBy = await Promise.all(
          post.likedBy.map(async (id) => {
            const likedInfo = await UserModel.findById(id).select('_id fullName');
            return {
              userId: likedInfo?._id,
              userName: likedInfo?.fullName
            };
          })
        );
        post.numberOfLikes = post.likedBy.length;
        post.save();
        updateUserRank(DISLIKE_POINT, post.ownerId);
        return resolve({
          message: 'Post unliked!',
          data: {
            numberOfLikes: post.numberOfLikes,
            likedBy
          }
        });
      }
      post.likedBy.push(userId);
      const likedBy = await Promise.all(
        post.likedBy.map(async (id) => {
          const likedInfo = await UserModel.findById(id).select('_id fullName');
          return {
            userId: likedInfo?._id,
            userName: likedInfo?.fullName
          };
        })
      );
      post.numberOfLikes = post.likedBy.length;
      post.save();
      updateUserRank(LIKE_POINT, post.ownerId);
      resolve({
        message: 'Post liked!',
        data: {
          numberOfLikes: post.numberOfLikes,
          likedBy
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// dislike post
const dislikePost = (postId: string, userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        return reject({ message: 'Post not found!' });
      }
      const existLikeIndex = post.likedBy.findIndex((id) => id === userId);
      if (existLikeIndex !== -1) {
        return reject({ message: 'You have already liked this post!' });
      }
      const existDislikeIndex = post.dislikedBy.findIndex((id) => id === userId);
      if (existDislikeIndex !== -1) {
        post.dislikedBy.splice(existDislikeIndex, 1);
        const dislikedBy = await Promise.all(
          post.dislikedBy.map(async (id) => {
            const dislikedInfo = await UserModel.findById(id).select('_id fullName');
            return {
              userId: dislikedInfo?._id,
              userName: dislikedInfo?.fullName
            };
          })
        );
        post.numberOfDislikes = post.dislikedBy.length;
        post.save();
        updateUserRank(LIKE_POINT, post.ownerId);
        return resolve({
          message: 'Post undisliked!',
          data: {
            dislikedBy,
            numberOfDislikes: post.numberOfDislikes
          }
        });
      }
      post.dislikedBy.push(userId);
      const dislikedBy = await Promise.all(
        post.dislikedBy.map(async (id) => {
          const dislikedInfo = await UserModel.findById(id).select('_id fullName');
          return {
            userId: dislikedInfo?._id,
            userName: dislikedInfo?.fullName
          };
        })
      );
      post.numberOfDislikes = post.dislikedBy.length;
      post.save();
      updateUserRank(DISLIKE_POINT, post.ownerId);
      resolve({
        message: 'Post disliked!',
        data: {
          dislikedBy,
          numberOfDislikes: post.numberOfDislikes
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  createPost,
  getRandomPosts,
  getOwnPosts,
  getSavedPosts,
  getGroupPosts,
  getPostById,
  likePost,
  dislikePost,
  updatePost,
  deletePost
};
