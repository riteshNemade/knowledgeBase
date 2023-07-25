const {db} = require('../config/database');

const customError= require('../utils/customError')




async function subscribeService(body, user_id) {

    let {articleId}=body;
    try{
    await db('subscriber_info').insert({
        articleId,
        user_id
    })
    return {data:'Subscribed Successfully'}
    }catch(err){
        throw new customError(err.mssage,500);
    }

}
async function unsubscribeService(body, user_id) {

    let {articleId}=body;
    try{
    await db('subscriber_info')
    .where('user_id',user_id)
    .andWhere('articleId',articleId)
    .del()
    return {data:'Unsubsribed'};
    }catch(err){
        throw new customError(err.mssage,500);
    }

}



module.exports = {
    subscribeService,
    unsubscribeService
}