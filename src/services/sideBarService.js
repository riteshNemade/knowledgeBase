const Article = require('../models/articleSchema');
const Content = require('../models/contentSchema');
const contentInit = require('../utils/contentInit');
const customError = require('../utils/customError');
const { db } = require('../config/database')

async function getService(articleId) {
    try {
        if(articleId){
        const temp = await Article.findById(articleId);
        const content = await Content.findOne({ parentId: articleId })
        if (temp.hasChild)
            return {
                parentId: temp._id,
                parentName: temp.articleName,
                createdBy: temp.createdBy,
                contentId: content._id,
                childArticles: temp.childArticles,
                allowedUsers: temp.allowedUsers
            };
        else
            return [];
        }
    } catch (err) {
        console.log(err);
    }

}

async function createService(body, user_id) {
    try {
        console.log("hi")
        let { articleName, parentId } = body;
        let allow = [];
        const temp = await Article.findById(parentId);

        allow.push(temp.createdBy);
        const sqlList = await db('article_editors').select('user_id').where('articleId', parentId);
        const newEditorIds = sqlList.map(entry => entry.user_id);

        const uniqueEditors = new Set(allow.concat(newEditorIds));

        // Convert back to array format
        allow = Array.from(uniqueEditors);
        const allowedUsers = allow.concat(sqlList.user_id);

        let flag = false;
        for (let i = 0; i < allowedUsers.length; i++) {
            if (user_id === allowedUsers[i]) {
                flag = true;
                break;
            }
        }
        if (flag) {
            const newArticle = new Article({
                articleName,
                createdBy: user_id,
                parentId
            })
            await newArticle.save();
            let articleId = newArticle._id.toString();

            const newContent = new Content({
                parentId: articleId,
            });
            await newContent.save();



            contentInit(newContent._id.toString(), newContent.toString());

            let childArticle = {
                _id: newArticle._id,
                articleName: newArticle.articleName,
            }

            const updatedArticle = await Article.findByIdAndUpdate(
                parentId,
                {
                    $push: { childArticles: childArticle },
                    hasChild: true
                },
                { new: true }
            );

            let grandId = updatedArticle.parentId;
            console.log(grandId)
            if (grandId) {
                const grandArticle = await Article.findOne({ _id: grandId });
                const childArticles = grandArticle.childArticles;
                console.log(childArticles)
                const childArticleToUpdate = childArticles.find(child => child._id == updatedArticle._id.toString());
                console.log(childArticleToUpdate)
                childArticleToUpdate.hasChild = true;
                await grandArticle.save();
            }

            let result = {};

            result.articleId = newArticle._id.toString();
            result.contentId = newContent._id.toString();
            return result;
        } else {
            throw new customError('Unauthorized access', 401)
        }
    } catch (err) {
        console.log(err)
    }

}

async function patchService(body) {
    try {
        let articleName = body.articleName;
        const updateArticle = await Article.findByIdAndUpdate(
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
    if (article.childArticles.length>0)
        throw new customError('Article has child articles. Delete them first.', 400);
    else {
        const article = await Article.findById(articleId);
        const parentArticle = await Article.findById(article.parentId);


        // Find the index of the child article in the parent's childArticles array
        const childArticleIndex = parentArticle.childArticles.findIndex(
            (child) => child._id.toString() === article._id.toString()
        );

        // If the child article is found (index is not -1), remove it from the array
        if (childArticleIndex !== -1) {
            parentArticle.childArticles.splice(childArticleIndex, 1);
            parentArticle.markModified('childArticles');
            console.log(parentArticle)
            await parentArticle.save();
        }
        parentArticle.hasChild = false;


        await Article.findByIdAndDelete(articleId);

        return true;
    }
}
async function child(articleId) {
    try {
        const temp = await Article.findById(articleId);
        if (temp.hasChild)
            return temp.childArticles;
        else
            return [];
    } catch (err) {
        console.log(err);
    }
}

async function getEditors(articleId, user_id) {
    const temp = await db('article_editors').select('*').where('articleId', articleId);
}


module.exports = {
    createService,
    getService,
    patchService,
    deleteService,
    child
}