const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  parentId:{
   type:  mongoose.Schema.Types.ObjectId,
   ref: 'Article' 
  },
  content: {
    type: String,
    required: true,
    default: ' '
  },
  cloneId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clone'
  }
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
