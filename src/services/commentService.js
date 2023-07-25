const { mongoose } = require('../config/database');

const Comment = require('../models/commentSchema');
const Reply = require('../models/replySchema');

const customError = require('../utils/customError')

async function getService(parentId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      throw new Error('Invalid parent_id format');
    }

    const comments = await Comment.findAll({ parentId });

    if (!comments) {
      return null;
    }

    return { data: comments };
  } catch (err) {
    throw new customError(err.message, 500)
  }

}


async function createService(body,user_id ) {
  try {
    const newComment = new Comment({
      comment: body.comment,
      parentId: body.parentId,
      createdBy:user_id,
    });
    const savedComment = await newComment.save();

    return { id: savedComment._id.toString() };
  } catch (err) {
    throw new customError('Something went wrong', 500)
  }
}

async function patchService(body, commentId) {
  try {
    const updatedContent = await Comment.findByIdAndUpdate(
      commentId,
      { comment: body.comment },
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

async function deleteService(commentId) {
  await Reply.deleteMany({parentId: commentId})
  await Comment.findByIdAndDelete(
    commentId,
    (err, deletedComment) => {
        if (err) {
          throw new customError(err.message,400);
        } else if (deletedComment) {
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