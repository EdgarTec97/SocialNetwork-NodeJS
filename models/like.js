const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = Schema({
  idPublication: {
    type: Schema.Types.ObjectId,
    ref: 'Publication',
    require: true
  },
  idUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
});
module.exports = mongoose.model('Like',LikeSchema);