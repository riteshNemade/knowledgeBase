const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService

} = require('../services/mergeEditService');



const getEdits = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await getService(req.params.articleId));
})
const createFeedback = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await createService(req.body,req.user.user_id));
})

module.exports = { getEdits }