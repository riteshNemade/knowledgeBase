const { mongoose } = require('../config/database');
const { db } = require('../config/database');

const Comment = require('../models/commentSchema');


const customError = require('../utils/customError')

async function getService(parentId) {
  try {
    


    const comments = await Comment.find({ parentId });
  
    if (!comments || comments.length === 0) {
      return null;
    }

    return { data: comments };
  } catch (err) {
    console.log(err);
    throw new customError(err.message, 500)
  }

}


async function createService(body,user_id ) {
  try {
    const name=await db('users').select('full_name').where('user_id',user_id);
    console.log(name);
    const newComment = new Comment({
      comment: body.comment,
      parentId: body.parentId,
      user_id:user_id,
      name:name[0].full_name,
    });
    const savedComment = await newComment.save();


    return { data: savedComment };
  } catch (err) {
    console.log(err);
    console.log(err)
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
  await Comment.findByIdAndDelete(
    commentId
  );
  return true;
  
}


module.exports = {
  createService,
  getService,
  patchService,
  deleteService
}