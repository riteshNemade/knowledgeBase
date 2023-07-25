const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  parentId:{
   type:  mongoose.Schema.Types.ObjectId,
   ref: 'Article' 
  },
  content: {
    type: String,
    required: true,
  },
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
