const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  Views:{
    type: Number,
    default:0
  },
  articleName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  parentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    default: null
  },
  hasChild:{
    type: Boolean,
    required: true,
    default: false
  },
  createdBy:{
    type: Number,
    required: true,
  },
  allowedUsers:[
    {
      type: Number
    }
  ],
  childArticles: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
      articleName: {
        type: String,
        required: true,
      },
      hasChild: {
        type: Boolean,
        required: true,
        default: false,
      }
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  Views:{
    type: Number,
    default:0
  },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
