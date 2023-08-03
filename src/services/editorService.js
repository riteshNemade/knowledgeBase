const {db} = require('../config/database');

const customError= require('../utils/customError')




async function createService(body, user_id) {

    let {articleId,email}=body;
    try{
        const userId= await db('users').select("user_id").where("email",email).limit(1);
        console.log('Added'+ userId[0].user_id);
        const exists= await db('article_editors').select('id').where('articleId',articleId).andWhere('user_id',userId[0].user_id);
        console.log(exists)
        if(exists.length==0){
    await db('article_editors').insert({
        articleId,
        user_id:userId[0].user_id
    })
    return {data:'Editor invited Successfully'}
}else{
    throw new customError('Already Invited',500)
}
    }catch(err){
        throw new customError(err.message,500);
    }

}

async function getService(articleId) {

    
    try{
   
    const result=await db('article_editors').select('*')
    .where('articleId',articleId)
    if(result.length>0)
        return {data:true};
    else
        return {data:false};
    
    }catch(err){
        throw new customError(err.mssage,500);
    }

}



module.exports = {
    getService,
    createService,
}