const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService,
    createService,
    patchService,
    deleteService
} = require('../services/contentService');



const getContent = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await getService(req.params.parentId));
})
const createContent = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await createService(req.body,req.body.parentId));
})
const patchContent = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await patchService(req.body,req.body.contentId));
})
const deleteContent = asyncHandler(async function (req,res){ 
    const flag=await deleteService(req.body.contentId)
    if(flag===true)                          //CRUD   
        res.status(201).json({message:'Content Deleted.'});
    else
        res.status(500).json({message:'Something went wrong'});
})

module.exports = { getContent, createContent, patchContent, deleteContent }