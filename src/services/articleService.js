const {db} = require('../config/database');

const Clone=require('../models/cloneSchema')
const Content = require('../models/contentSchema');
const Article = require('../models/articleSchema');
const customError= require('../utils/customError');
const contentInit=require('../utils/contentInit')

async function getService(parent_id) {
    let result = await db
        .select('articleId', 'articleName','creatorId')
        .from('article_relations')
        .where('parentId',parent_id)
        .catch(() => {
            throw new customError('No Articles Found.', 404);
        });
    
    for(let i=0;i<result.length;i++){
        let article= await db('article_editors')
                    .select('user_id')
                    .where('articleId',result[i].articleId)
        
        result[i].editors=article;
    }
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
    let result={};
    result.articleId=articleId;
    result.contentId=newContent._id.toString();
    return result;
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

async function inviteUsers(body){
    const user_id=await db('users').select('user_id').where('email',body.email);
    await db('article_editors').insert({
        articleId:body.articleId,
        user_id:user_id
    })
}


module.exports = {
    createService,
    getService,
    patchService,
    deleteService
}