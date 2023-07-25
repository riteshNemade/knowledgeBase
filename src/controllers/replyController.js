const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService,
    createService,
    patchService,
    deleteService
} = require('../services/replyService');



const getReplies = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await getService(req.body.parentId));
})
const createReply = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await createService(req.body,req.user.user_id));
})
const patchReply = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await patchService(req.body));
})
const deleteReply = asyncHandler(async function (req,res){ 
    const flag=await deleteService(req.body.replyId,req.user.user_id)
    if(flag===true)                          //CRUD   
        res.status(201).json({message:'Content Deleted.'});
    else
        res.status(500).json({message:'Something went wrong'});
})

module.exports = { getReplies, createReply, patchReply, deleteReply }