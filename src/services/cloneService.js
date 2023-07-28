const Article = require('../models/articleSchema');
const Content = require('../models/contentSchema');
const Clone = require('../models/cloneSchema');
const contentInit = require('../utils/contentInit');
const customError = require('../utils/customError');
const {db}=require('../config/database')

async function getService(articleId) {
    try{
        const temp= await Clone.findOne({parentId:articleId});
            return { 
               roomId:temp._id.toString(),
            };
       
        }catch(err){
            console.log(err);
        }

}

async function createService(body) {
    
    const existingClone= await Clone.find({parentId:body.parentId});
    console.log(existingClone)
    if(existingClone.length>0){
    return existingClone;
    }
    else{
        const parentContent=await Content.findById(body.parentId);
        const newClone=new Clone({
            parentId: parentContent._id.toString(),
            content: parentContent.content,
        })
        return await newClone.save()
        
    }
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
async function child(articleId){
    try{
    const temp= await Article.findById(articleId);
    if(temp.hasChild)
        return temp.childArticles;
    else
        return [];
    }catch(err){
        console.log(err);
    }
}



module.exports = {
    createService,
    getService,
    patchService,
    deleteService,
    child
}