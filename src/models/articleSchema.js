const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  Views: {
    type: Number,
    default: 0
  },
  articleName: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    default: null
  },
  hasChild: {
    type: Boolean,
    required: true,
    default: false
  },
  createdBy: {
    type: Number,
    required: true,
  },
  allowedUsers: [
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
      },
      sequence: {
        type: Number
      }
    },
  ],
  Comments:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
