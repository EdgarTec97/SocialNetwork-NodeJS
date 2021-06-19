const Follow = require("../models/follow");
const User = require("../models/user");

const FollowController = {
  follow: async function(username, ctx) {
    const userFound = await User.findOne({ username });
    if (!userFound) throw new Error("Usuario no encontrado");

    try {
      if(ctx.user.id !== userFound._id){
        const follow = new Follow({
          idUser: ctx.user.id,
          follow: userFound._id,
        });
        follow.save();
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  isFollow: async function(username, ctx) {
    const userFound = await User.findOne({username});
    if (!userFound) throw new Error("Usuario no encontrado");
    const follow = await Follow.find({idUser: ctx.user.id}).where("follow").equals(userFound._id);

    if(follow.length > 0){
      return true;
    }
    return false;

  },

  unFollow: async function(username, ctx) {
    const userFound = await User.findOne({username});
    if (!userFound) throw new Error("Usuario no encontrado");
    const follow = await Follow.deleteOne({idUser: ctx.user.id}).where('follow').equals(userFound._id);
    if(follow.deletedCount>0) return true;
    return false;
  },

  getFollowers: async function(username) {
    const user = await User.findOne({username});
    if (!user) throw new Error("Usuario no encontrado");
    const followers = await Follow.find({follow: user._id}).populate('idUser');
    const followersList = [];
    for await (const data of followers){
      followersList.push(data.idUser);
    }
    return followersList;
  },

  getFolloweds: async function(username) {
    const user = await User.findOne({ username });
    const followeds = await Follow.find({ idUser: user._id }).populate("follow");

    const followedsList = [];
    for await (const data of followeds) {
      followedsList.push(data.follow);
    }

    return followedsList;
  },

  getNotFolloweds: async function({user}) {
    const users = await User.find().limit(50);
    const arrayUsers = [];
    for await (let usr of users){
      const isFind = await Follow.findOne({idUser: user.id}).where({'follow': usr._id});
      if(!isFind){
        if(usr._id.toString() != user.id.toString()){
          arrayUsers.push(usr);
        }
      }
    }
    return arrayUsers;
  }
}

module.exports = FollowController;
