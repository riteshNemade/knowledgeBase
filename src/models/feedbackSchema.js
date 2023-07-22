const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    createdBy:{
      type: Number,
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    parentId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Article'
    }
});


const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
