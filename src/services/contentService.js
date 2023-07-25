const { mongoose } = require('../config/database');

const Content = require('../models/contentSchema');

const Article = require('../models/articleSchema');
const customError = require('../utils/customError')

async function getService(parentId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      throw new Error('Invalid parent_id format');
    }

    const content = await Content.findOne({ parentId });

    if (!content) {
      return null;
    }

    return { content };
  } catch (err) {
   
    throw new customError(err.message, 500)
  }

}


async function createService(body, parentId) {
  try {
    const newContent = new Content({
      content: body.content,
      parentId,
    });

    const savedContent = await newContent.save();
    console.log(savedContent);
    await Article.findByIdAndUpdate(parentId,{content:savedContent._id.toString()})
    return { id: savedContent._id };
  } catch (err) {
    throw new customError(err.message, 500)
  }
}

async function patchService(body, contentId) {
  try {
    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      { content: body.content },
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

async function deleteService(contentId) {
  const deletedContent = await Content.findByIdAndUpdate(
    contentId,
    { content: null }, // Set the 'content' field to null
    { new: true } // Return the updated document after the update (optional)
  );
  if (!deletedContent)
    throw new customError('No content found to delete', 404)
  else {
    return true;
  }
}


module.exports = {
  createService,
  getService,
  patchService,
  deleteService
}