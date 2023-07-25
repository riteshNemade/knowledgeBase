const { mongoose } = require('../config/database');

const Comment = require('../models/commentSchema');
const Reply = require('../models/replySchema');

const customError = require('../utils/customError')

async function getService(parentId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      throw new Error('Invalid parent_id format');
    }

    const replies = await Reply.find({ parentId });

    if (!replies) {
      return null;
    }

    return { data: replies };
  } catch (err) {
    throw new customError(err.message, 500)
  }

}


async function createService(body, user_id) {
  try {
    const newReply = new Reply({
      reply: body.reply,
      parentId: body.parentId,
      createdBy: user_id,
    });
    const savedReply = await newReply.save();

    return { id: savedReply._id.toString() };
  } catch (err) {
    throw new customError('Something went wrong', 500)
  }
}

async function patchService(body) {
  try {
    const updatedContent = await Reply.findByIdAndUpdate(
      body.replyId,
      { reply: body.reply },
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

async function deleteService(replyId, userId) {
  try {
  
    const reply = await Reply.findById(replyId);

  
    if (!reply) {
      console.log('Reply not found');
      return false;
    }

    // Check if the user deleting is the creator of the reply
    if (reply.createdBy !== userId) {
      console.log('You are not authorized to delete this reply');
      return false;
    }

    // Delete the reply since it exists and the user is the creator
    const deletedReply = await Reply.findByIdAndDelete(replyId);

    if (deletedReply) {
      return true;
    } else {
      console.log('Reply not found');
      return false;
    }
  } catch (err) {
    throw new customError(err.message, 400);
  }
}


module.exports = {
  createService,
  getService,
  patchService,
  deleteService
}