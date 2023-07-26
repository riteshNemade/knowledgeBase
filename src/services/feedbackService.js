const { mongoose } = require('../config/database');

const feedback = require('../models/feedbackSchema');
const customError = require('../utils/customError')

async function getService(parentId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      throw new Error('Invalid parent_id format');
    }

    const feedbacks = await feedback.findAll({ parentId }).sort({ timestamp: -1 });

    if (!feedbacks) {
      return null;
    }

    return { data: feedbacks };
  } catch (err) {
    throw new customError(err.message, 500)
  }

}


async function createService(body,user_id ) {
  try {
    const newFeedback = new feedback({
      feedback: body.feedback,
      parentId: body.parentId,
      createdBy:user_id,
    });
    const savedFeedback = await newFeedback.save();

    return { id: savedFeedback._id.toString() };
  } catch (err) {
    throw new customError('Something went wrong', 500)
  }
}

async function patchService(body, feedbackId) {
  try {
    const updatedContent = await Comment.findByIdAndUpdate(
      feedbackId,
      { feedback: body.feedback },
      { new: true }
    );

    if (!updatedContent) {
      throw new customError('Content not found', 404);
    }
    else {
      return { message: 'Updated Successfully' };
    }


  } catch (err) {
    throw new customError('Something went wrong', 500)
  }
}

async function deleteService(feedbackId) {
  await Content.findByIdAndDelete(
    feedbackId,
    (err, deletedFeedback) => {
        if (err) {
          throw new customError(err.message,400);
        } else if (deletedFeedback) {
          return true;
        } else {
          console.log('Comment not found');
          return false;
        } 
    }
  );
  
}


module.exports = {
  createService,
  getService,
  patchService,
  deleteService
}