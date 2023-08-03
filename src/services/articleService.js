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

async function views(id){

    const updatedArticle = await Article.findByIdAndUpdate(id, { $inc: { Views: 1 } }, { new: true });
   console.log("view++")
}
async function likes(articleId,user_id){
    const result= await db("article_likes").select('*').where('articleId',articleId).andWhere('user_id',user_id);
    
    if(result && result.length>0){
        if(result[0].status==1)
            throw new customError('Already Liked.',400);
        else
            await db('article_likes').update('status',1).where('articleId',articleId).andWhere('user_id',user_id);
            return true;
    }
    else{
        await db('article_likes').insert({
            articleId: articleId,
            user_id: user_id,
            status: 1
        })
        return true;
    }
}
async function dislike(articleId,user_id){
    const result= await db("article_likes").select('*').where('articleId',articleId).andWhere('user_id',user_id);
    
    if(result && result.length>0){
        if(result[0].status==0)
            throw new customError('Already Disliked.',400);
        else{
            await db('article_likes').update('status',0).where('articleId',articleId).andWhere('user_id',user_id);
            return true;
        }
    }
    
}
async function getLikesService(articleId){
    const result= await db("article_likes").count('* as likes').where('articleId',articleId).andWhere('status',1);
    console.log(result);
    if(result)
        return result
    else{
        return 0;
    }
}
async function getUserLikeService(articleId,user_id){
    const result= await db("article_likes").select('*').where('articleId',articleId).andWhere('user_id',user_id).andWhere('status',1);
    console.log(result);
    if(result && result.length>0)
        return true
    else{
        return false;
    }
}


module.exports = {
    createService,
    getService,
    patchService,
    deleteService,
    views,
    likes,
    dislike,
    getLikesService,
    getUserLikeService
}