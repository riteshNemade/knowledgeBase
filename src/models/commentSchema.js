const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const commentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  content: {
    type: String,
    required: true,
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports=Comment;