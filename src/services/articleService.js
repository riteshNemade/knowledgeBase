const {db} = require('../config/database');

const Clone=require('../models/cloneSchema')
const Content = require('../models/contentSchema');
const Article = require('../models/articleSchema');
const customError= require('../utils/customError');
const contentInit=require('../utils/contentInit')

async function getService(parent_id) {
    let result = await db
        .select('articleId', 'articleName')
        .from('article_relations')
        .where('parentId',parent_id)
        .catch(() => {
            throw new customError('No Articles Found.', 404);
        });
    
    return { "data": result };

}


async function createService(body, user_id) {

    let {articleName,parentId}=body;
    try{
    const newArticle = new Article({ 
        articleName,
        createdBy: user_id
      });
  
    await newArticle.save();
    let articleId=newArticle._id.toString();
    
    const newContent = new Content({
        parentId:articleId,
      });
    await newContent.save();

    let cloneId=newContent._id.toString();
    const newClone = new Clone({
        parentId:cloneId,
    });
    await newClone.save();  
    
    console.log(articleId,cloneId,newClone._id.toString());


    contentInit(newContent._id.toString(),newContent.toString());

    await db('article_relations').insert({
        articleId,
        articleName,
        parentId,
        creatorId: user_id
    }).catch((err) => {
        console.log(err)    
        throw new customError(err.message, 500);
        })

    return articleId;
    }catch(err){
        console.log(err)
        throw new customError(err.mssage,500)
    }

}

async function patchService(body) {
    let flag=false;
    let articleName=body.articleName;
    let updateObject = {
        ...(body.articleName && { articleName: articleName })
    };
    await db('article_relations')
        .where('articleId', body.articleId)
        .update(updateObject)
        .then(async ()=>{
            let _id=body.articleId; 
            await Article.findByIdAndUpdate(
            _id,
            { $set: { articleName: articleName } }
          ).catch((err)=>{
            console.log(err)
          })
            flag=true;
        });
    
    return flag;
}

async function deleteService(body) {
    const result = await db('article_relations')
        .where('articleId', body.articleId)
        .del()
        .then(async ()=>{
            await Article.findOneAndDelete({ _id: body.articleId });
        });

    return result;
}


module.exports = {
    createService,
    getService,
    patchService,
    deleteService
}