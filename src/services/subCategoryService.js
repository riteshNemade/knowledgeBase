const {db} = require('../config/database');
const customError = require('../utils/customError');
const sendEmail = require('../utils/sendEmail');


async function getService(id) {
    let result = await db
        .select('id', 'subCategoryName')
        .from('sub_categories')
        .where('parentId',id)
        .catch(() => {
            throw new customError('No Subcategories Found.', 404);
        });
    
    return { "data": result };

}


async function createService(body, user_id) {
    const timestamp = new Date;
    let {categoryName,parentId}=body;

    let data;
    await db('sub_categories').insert({
        subCategoryName: categoryName,
        parentId,
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
        ...(body.categoryName && { subCategoryName: body.categoryName })
    };
    await db('sub_categories')
        .where('id', body.categoryId)
        .update(updateObject)
        .then(() => { message = true });

    return message;
}

async function deleteService(id) {
    const result = await db('sub_categories')
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