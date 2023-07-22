const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    createdBy:{
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parentId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  })

const Reply = mongoose.model('Reply', replySchema);

module.exports=Reply;