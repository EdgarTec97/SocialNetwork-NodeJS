'use strict'
const UserController = require('../controllers/user');
const FollowController = require('../controllers/follow');
const PublicationController = require('../controllers/publication');
const CommentController = require('../controllers/comment');
const LikeController = require('../controllers/like');

const resolvers = {
    Query: {
        //User
        getUser: (_,{id,username}) => UserController.getUser(id,username),
        search: (_,{search}) => UserController.search(search),
        //Follow
        isFollow: (_,{username},ctx) => FollowController.isFollow(username,ctx),
        getFollowers: (_,{username}) => FollowController.getFollowers(username),
        getFolloweds: (_,{username}) => FollowController.getFolloweds(username),
        getNotFolloweds: (_,{},ctx) => FollowController.getNotFolloweds(ctx),
        //Publication
        getPublications: (_,{username}) => PublicationController.getPublications(username),
        getPublicationsFolloweds: (_,{},ctx) => PublicationController.getPublicationsFolloweds(ctx),
        //Comments
        getComments: (_,{idPublication}) => CommentController.getComments(idPublication),
        //Like
        isLike: (_,{idPublication},ctx) => LikeController.isLike(idPublication,ctx),
        countLike: (_,{idPublication}) => LikeController.countLikes(idPublication)
    },
    Mutation: {
        //User
        register: (_,{input}) =>UserController.register(input),
        login: (_,{input}) => UserController.login(input),
        updateAvatar: (_,{file},ctx) => UserController.updateAvatar(file,ctx),
        deleteAvatar: (_,{},ctx) => UserController.deleteAvatar(ctx),
        updateUser: (_,{input},ctx) => UserController.updateUser(input,ctx),
        //Follow
        follow: (_,{username},ctx) => FollowController.follow(username,ctx),
        unFollow: (_,{username},ctx) => FollowController.unFollow(username,ctx),
        //Publication
        publish: (_,{file},ctx) => PublicationController.publish(file,ctx),
        //Comment
        addComment: (_,{input}, ctx) =>  CommentController.addComment(input,ctx),
        //Like
        addLike: (_,{idPublication},ctx) => LikeController.addLike(idPublication,ctx),
        deleteLike: (_,{idPublication},ctx) => LikeController.deleteLike(idPublication,ctx),
    }
}
module.exports = resolvers;