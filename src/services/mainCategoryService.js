const {db} = require('../config/database');
const customError = require('../utils/customError');
const sendEmail = require('../utils/sendEmail');


async function getService() {
    let result = await db
        .select('id', 'categoryName')
        .from('main_categories')
        .catch(() => {
            throw new customError('No Articles Found.', 404);
        });
    
    return { "data": result };

}


async function createService(body, user_id) {
    const timestamp = new Date;
    let {categoryName,description,image_name}=body;
    
    let data;
    await db('main_categories').insert({
        categoryName,
        description,
        image_name,
        creatorId: user_id,
        created_at: timestamp
    }).then(async (row) => {
        if (row)
            data = row[0];
    })
        .catch((err) => {
            throw new customError(err.message, 500);
        })
    return data;

}

async function patchService(body) {
    let message = false;
    let updated_at = new Date;
    let updateObject = {
        ...(body.categoryName && { categoryName: body.categoryName }),
        ...(body.image_name && { image_name: body.image_name }),
        ...(body.description && { description: body.description }),
        ...({ updated_at: updated_at })
    };
    await db('main_categories')
        .where('id', body.categoryId)
        .update(updateObject)
        .then(() => { message = true });

    return message;
}

async function deleteService(id) {
    const result = await db('main_categories')
        .where('id', id)
        .del();

    return result;
   
}


module.exports = {
    createService,
    getService,
    patchService,
    deleteService
}