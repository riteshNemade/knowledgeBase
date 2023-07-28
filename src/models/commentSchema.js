const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user_id:{
    type: Number,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports=Comment;