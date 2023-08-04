const { db } = require('../config/database');

const customError = require('../utils/customError')

async function subscribeService(body, user_id) {

    let { articleId } = body;
    try {
        await db('subscriber_info').insert({
            articleId,
            user_id
        })
        console.log('Subscribed')
        return { data: 'Subscribed Successfully' }
    } catch (err) {
        throw new customError(err.mssage, 500);
    }

}

async function unsubscribeService(body, user_id) {

    let { articleId } = body;
    try {
        await db('subscriber_info')
            .where('user_id', user_id)
            .andWhere('articleId', articleId)
            .del()
        console.log('Unsubscribed')
        return { data: 'Unsubsribed' };
    } catch (err) {
        throw new customError(err.mssage, 500);
    }

}
async function getSubService(articleId, user_id) {


    try {

        const result = await db('subscriber_info').select('*')
            .where('user_id', user_id)
            .andWhere('articleId', articleId)
        if (result.length > 0)
            return { data: true };
        else
            return { data: false };

    } catch (err) {
        throw new customError(err.mssage, 500);
    }

}



module.exports = {
    subscribeService,
    unsubscribeService,
    getSubService
}