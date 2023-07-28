const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService,
    createService,
    patchService,
    deleteService
} = require('../services/feedbackService');



const getFeedbacks = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await getService(req.params.parentId));
})
const createFeedback = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await createService(req.body,req.user.user_id));
})
const patchFeedback = asyncHandler(async function (req,res){                           //CRUD   
    res.status(201).json(await patchService(req.body,req.body.feedbackId));
})
const deleteFeedback = asyncHandler(async function (req,res){ 
    const flag=await deleteService(req.body.feedbackId)
    if(flag===true)                          //CRUD   
        res.status(201).json({message:'Content Deleted.'});
    else
        res.status(500).json({message:'Something went wrong'});
})

module.exports = { getFeedbacks, createFeedback, patchFeedback, deleteFeedback }