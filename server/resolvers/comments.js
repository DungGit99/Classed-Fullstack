const {UserInputError} = require ('apollo-server');
const {AuthenticationError} = require ('apollo-server');
const Post = require('../models/Post');
const checkAuth = require('../util/auth');
module.exports = {

    Mutation: {
        async createComment(parent, { postId, body }, context) {

            const { username } = checkAuth(context);

            if (body.trim() === '') {
              throw new UserInputError('Empty comment', {
                errors: {
                  body: 'Comment body must not empty'
                }
              });
            }

            const post = await Post.findById(postId);

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createAt: new Date().toISOString()
                });

                await post.save();
                return post;
            }
            else throw new UserInputError('Post not found');

        },
        async deleteComment(parent, { postId, commentId }, context) {

            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex((c) => c.id === commentId);

                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } else {
              throw new UserInputError('Post not found');
            }
        },
        async likePost(parent,{postId},context){

            const {username}=checkAuth(context);
            const post = await Post.findById(postId);

            if(post){

                if(post.likes.find((like)=>like.username===username)){
                    // Post already likes ,unlike it
                    post.likes = post.likes.filter((like)=>like.username !== username);
                }else{
                    // No like , like post
                    post.likes.push({
                        username,
                        createAt: new Date().toISOString()
                    });
                }
                await post.save();
                return post;
            }else{
                throw new UserInputError('Post not found');
            }
        }
    }
}