const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  articleName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
  hasChild:{
    type: Boolean,
    required: true,
    default: false
  },
  childArticles: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  likes: {
    type: Number,
    default: 0,
  },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
