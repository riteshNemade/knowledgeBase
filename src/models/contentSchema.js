const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  parentId:{
   type:  mongoose.Schema.Types.ObjectId,
   ref: 'Article' 
  },
  content: {
    type: Object,
  },
  cloneId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clone'
  },
  text:{
    type:String,
  }
});

contentSchema.index({ text: 'text' });




const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
