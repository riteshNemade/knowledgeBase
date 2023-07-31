const { mongoose } = require('../config/database');

const Content = require('../models/contentSchema');

const Article = require('../models/articleSchema');
const customError = require('../utils/customError');
const contentCommit = require('../utils/contentCommit');
const contentHistory = require('../utils/contentHistory');
const prevContent = require('../utils/prevContent');
const Clone = require('../models/cloneSchema');

async function getService(articleId) {
  try {
    const content = await Content.findOne({parentId:articleId});
    console.log(content);
    const clone = await Clone.findOne({parentId:content._id});
    return {
        content: content,
        clone: clone
    }
  } catch (err) {
   
    throw new customError(err.message, 500)
  }

}
async function mergeService(contentId) {
  try {

    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      { content: body.content,text: body.text},
      { new: true }
    );
    if (!updatedContent) {
      throw new customError('Content not found', 404);
    }
    else {
      contentCommit(contentId,body.content);
      return { message: 'Updated Successfully' };
    }

  } catch (err) {
    console.log(err)
    throw new customError('Something went wrong', 500)
  }
}


module.exports = {
  
  getService
  
  
}