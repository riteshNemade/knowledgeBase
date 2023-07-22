const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  createdBy:{
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'replySchema'
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default:0
  },
  dislikes: {
    type:Number,
    default:0
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports=Comment;