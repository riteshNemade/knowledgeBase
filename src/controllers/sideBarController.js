const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService,
    createService,
    patchService,
    deleteService
} = require('../services/sideBarService');


const getChildArticles = asyncHandler(async function (req,res){                     //cRud. THIS IS FOR SIDEBAR
    res.status(201).json(await getService(req.body.articleId))
})

const createChildArticle = asyncHandler(async function (req,res){                     //Crud. THIS IS FOR SIDEBAR
    res.status(201).json(await createService(req.body,req.user.user_id))
})
const patchChildArticle = asyncHandler(async function (req,res){                     //crUd. THIS IS FOR SIDEBAR
    res.status(201).json(await patchService(req.body))
})
const deleteChildArticle = asyncHandler(async function (req,res){                     //cruD. THIS IS FOR SIDEBAR
    res.status(201).json(await deleteService(req.body.articleId))
})


module.exports = { getChildArticles, createChildArticle, patchChildArticle, deleteChildArticle }