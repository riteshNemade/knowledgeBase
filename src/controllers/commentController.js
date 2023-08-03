const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService,
    createService,
    patchService,
    deleteService
} = require('../services/commentService');



const getComments = asyncHandler(async function (req,res){                          
    res.status(201).json(await getService(req.params.parentId));
})
const createComment = asyncHandler(async function (req,res){                       
    res.status(201).json(await createService(req.body,req.user.user_id));
})
const patchComment = asyncHandler(async function (req,res){                          
    res.status(201).json(await patchService(req.body,req.body.commentId));
})
const deleteComment = asyncHandler(async function (req,res){ 
    const flag=await deleteService(req.body.commentId)
    if(flag===true)                         
        res.status(201).json({message:'Comment Deleted.'});
    else
        res.status(500).json({message:'Something went wrong'});
})

module.exports = { getComments, createComment, patchComment, deleteComment }