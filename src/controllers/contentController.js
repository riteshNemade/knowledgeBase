const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService,
    createService,
    patchService,
    deleteService
} = require('../services/contentService');



const getContent = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await getService(req.body.articleId));
})
const createContent = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await getService(req.body.articleId));
})
const patchContent = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await getService(req.body.articleId));
})
const deleteContent = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await getService(req.body.articleId));
})

module.exports = { getArticle, createArticle, patchArticle, deleteArticle }