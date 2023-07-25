const Article = require('../models/articleSchema');
const Content = require('../models/contentSchema');
const contentInit = require('../utils/contentInit');
const customError = require('../utils/customError');

async function getService(articleId) {
    const childArticles =                                            //this will return childArticles array
        await Article
            .findOne({ _id: articleId }, 'childArticles')
            .catch((err) => {
                throw new customError(err.message, 500);
            });
    return childArticles;

}

async function createService(body, user_id) {

    let { articleName, parentId } = body;

    const newArticle = new Article({
        articleName,
        createdBy: user_id,
        parentId
    })
    await newArticle.save();
    let articleId=newArticle._id.toString();

    const newContent = new Content({
        parentId:articleId,
      });
    await newContent.save();
    contentInit(newContent._id.toString(),newContent.toString());
    let childArticle = {
        _id: newArticle._id,
        articleName: newArticle.articleName
    }
        
    const updatedArticle = await Article.findByIdAndUpdate(
        parentId,
        {
            $push: { childArticles: childArticle },
            hasChild: true
        },
        { new: true }
    );

    if (updatedArticle)
        return newArticle._id.toString();
    else
        return false;
}

async function patchService(body) {
    try {
        let articleName = body.articleName;
        const updateArticle=await Article.findByIdAndUpdate(
            body.articleId,
            { $set: { articleName: articleName } },
            { new: true }
        )
        const parentArticleId = updateArticle.parentId;
        if (parentArticleId) {
            await Article.findOneAndUpdate(
                { _id: parentArticleId, "childArticles._id": body.articleId },
                { $set: { "childArticles.$.articleName": articleName } },
                { new: true }
            );
        }
        
        return true;
    }
    catch (err) {
        throw new customError(err.message, 500)
    }
}

async function deleteService(articleId) {

        const article = await Article.findById(articleId);
        if (!article) {
            return false;
        }
        if(article.hasChild)
            throw new customError('Article has child articles. Delete them first.',400);
        else{        
            await Article.findByIdAndDelete(articleId);
            return true;     
        }                                           
    

}


module.exports = {
    createService,
    getService,
    patchService,
    deleteService
}