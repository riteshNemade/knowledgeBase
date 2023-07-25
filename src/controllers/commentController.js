const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService,
    createService,
    patchService,
    deleteService
} = require('../services/commentService');



const getComments = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await getService(req.body.parentId));
})
const createComment = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await createService(req.body,req.body.parentId));
})
const patchComment = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await patchService(req.body,req.body.commentId));
})
const deleteComment = asyncHandler(async function (req,res){ 
    const flag=await deleteService(req.body,req.body.commentId)
    if(flag===true)                          //CRUD   
        res.status(201).json({message:'Content Deleted.'});
    else
        res.status(500).json({message:'Something went wrong'});
})

module.exports = { getComments, createComment, patchComment, deleteComment }