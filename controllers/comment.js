const Comment = require("../models/comment");

const CommentController = {
  addComment: async function(input, ctx) {
    try {
      const comment = new Comment({
        idPublication: input.idPublication,
        idUser: ctx.user.id,
        comment: input.comment
      });
      const save = await comment.save();
      const id = save.id;
      const result = await Comment.findById(id).populate('idPublication').populate('idUser');
      return result;
    } catch (error) {
      console.log(error);
      throw Error("Error al comentar la publicación");
    }
  },

  getComments: async function(idPublication) {
    try {
      const result = await Comment.find({idPublication}).populate('idPublication').populate('idUser');
      return result;
    } catch (error) {
      console.log(error);
      throw Error("Error al comentar la publicación");
    }
  }
}
module.exports = CommentController;
