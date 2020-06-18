const Post = require('../models/Post');
const checkAuth = require('../util/auth');
const {AuthenticationError} = require('apollo-server');

module.exports={
    Query:{
        async getPosts(){
            try {
                const post = await Post.find().sort({createAt:-1});
                return post
            } catch (error) {
                throw new Error(error)
            }
        },
        async getPost(parent,{postId}){
            try {
                const post = await Post.findById(postId);
                if(post){
                    return post;
                }else{
                    throw new Error('Post not found');
                }
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation:{
        async createPost(parent,{body},context){
            const user = checkAuth(context);

            const newPost= new Post({
                body,
                username: user.username,
                createAt: new Date().toISOString()
            });
            const post = await newPost.save();
            // subscription
            context.pubsub.publish('NEW_POST', {
                newPost: post
            });

            return post;
        },
        async deletePost(parent,{postId},context){
            const user = checkAuth(context);
            try {
               const post = await Post.findById(postId);

               // username login === username create post
               if(user.username === post.username){
                    await post.delete();
                    return 'Post deleted successfully';
               }else{
                    throw new AuthenticationError('Action not allowed');
               }
            } catch (error) {
                throw new Error(error);
            }
        }
    },
    Subscription: {
        newPost: {
          subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
}