const Like = require("../models/like");

const LikeController = {
  addLike: async function(idPublication, {user}){
    try {
      const like = new Like({
        idPublication,
        idUser: user.id
      });
      like.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  deleteLike: async function(idPublication,{user}){
    try {
      const result = await Like.findOneAndDelete({idPublication})
                                .where({idUser:user.id});
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  isLike: async function(idPublication,{user}){
    try {
      const result = await Like.findOne({idPublication}).where({idUser:user.id});
      if(!result) throw new Error("No le has dado like");
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  countLikes: async function(idPublication){
    try {
      const result = await Like.countDocuments({idPublication});
      return result;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}

module.exports = LikeController;