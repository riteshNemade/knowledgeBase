const Article = require('../models/articleSchema');
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

    const newArticle = {
        articleName,
        createdBy: user_id,
        parentId
    }
    await newArticle.save();                                        //create a document for the article
    let childArticle = {
        _id: newArticle._id,
        articleName: newArticle.articleName
    }

    const updatedArticle = await Article.findByIdAndUpdate(         //update the reference in the parent article
        parentId,
        { $push: { childArticles: childArticle } },
        { new: true }
    );

    if (updatedArticle.length > 0)
        return newArticle._id.toString();
    else
        return false;
}

async function patchService(body) {
    try {
        let articleName = body.articleName;
        await Article.findByIdAndUpdate(
            _id,
            { $set: { articleName: articleName } },
            { new: true }
        )
        return true;
    }
    catch (err) {
        throw new customError(err.message, 500)
    }
}

async function deleteService(articleId) {

    try {
        
        const article = Article.findById(articleId);

        if (!article) {
            throw new customError('No Article Found', 404)
        }

        if (article.childArticles.length > 0) {
            for (const child of article.childArticles) {            //recursive deletion
                await deleteService(child._id);
            }
        }

        await Article.findByIdAndDelete(articleId);
        return true;                                                
    } catch (err) {
        throw new customError(err.message, 500);
    }

}


module.exports = {
    createService,
    getService,
    patchService,
    deleteService
}