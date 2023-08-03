//database and model imports
const { db } = require('../config/database');
const Article = require('../models/articleSchema');
const Content = require('../models/contentSchema');
const Clone = require('../models/cloneSchema');

//for version control 
const contentCommit = require('../utils/contentCommit');
const contentHistory = require('../utils/contentHistory');
const prevContent = require('../utils/prevContent');
//other utils
const { sendUpdateNotification } = require('../utils/sendEmail');
const customError = require('../utils/customError');



async function getService(parentId) {
  try {
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
    // Find the existing content associated with the parentId
    const existingContent = await Content.findOne({ parentId: parentId });

    // Update the content with the provided body.content
    existingContent.content = body.content;
    const savedContent = await existingContent.save();


    return { id: savedContent._id };
  } catch (err) {
    throw new customError(err.message, 500);
  }
}


async function patchService(body, contentId) {
  try {

    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      { content: body.content, text: body.text },
      { new: true }
    );

    if (!updatedContent) {
      throw new customError('Content not found', 404);
    }
    else {
      contentCommit(contentId, body.content);                                   //commits changes made to the respective repo 
      const clone = await Clone.findOne({ parentId: contentId })
      if (clone) {
        await Clone.findByIdAndUpdate(clone._id, { content: body.content })     //update the contents of the clone if mani content is changed.
      }
      const subscribers =
        await db('users')
          .select('email')
          .leftJoin('subscriber_info', 
          function () {                                                         //get emails of the users by using user_ids(stored in subscriber_info)
            this
              .on('users.user_id', '=', 'subscriber_info.user_id')
          })
          .where('articleId', updatedContent.parentId.toString())

      const article = await Article.findById(updatedContent.parentId)           //retrieve the article whose content got updated.
                 
      const arrayOfEmails = [
        ...new Set(subscribers.map((obj) => obj.email))                         //this line basically converts user objects into an array of emails
      ]; 

      sendUpdateNotification(                                                   //this function sends emails in a batch
        arrayOfEmails, 
        article.articleName, 
        updatedContent.parentId.toString()
        );
      return { message: 'Updated Successfully' };
    }
  } catch (err) {
    console.log(err)
    throw new customError('Something went wrong', 500)
  }
}

async function deleteService(contentId) {
  const deletedContent = await Content.findByIdAndUpdate(
    contentId,
    { content: null },                                                        // Set the 'content' field to null
    { new: true }                                                             // Return the updated document after the update (optional)
  );
  if (!deletedContent)
    throw new customError('No content found to delete', 404)
  else {
    return true;
  }
}

async function getHistory(contentId) {                                        //this function will list the hash codes of the previous version of the content.
  const result = contentHistory(contentId);
  return result;
}
async function getPrev(contentId, hash) {                                     //send hash to this function of previous versions to get 
  const result = prevContent(contentId, hash);                                //the content at that time.
  return result;
}


module.exports = {
  createService,
  getService,
  patchService,
  deleteService
}