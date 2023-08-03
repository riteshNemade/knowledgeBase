const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService,
    createService,
    patchService,
    deleteService,
    child,
    getNameService
} = require('../services/sideBarService');


const getChildArticles = asyncHandler(async function (req,res){                     //cRud. THIS IS FOR SIDEBAR
    res.status(201).json(await getService(req.params.articleId))
})

const createChildArticle = asyncHandler(async function (req,res){       
    const id=await createService(req.body,req.user.user_id)              //Crud. THIS IS FOR SIDEBAR
    res.status(201).json({id})
})
const patchChildArticle = asyncHandler(async function (req,res){  
    const flag=await patchService(req.body)
    if(flag)                   //crUd. THIS IS FOR SIDEBAR
        res.status(201).json({data:"Updated Successfully"});
    else
        res.status(500).json({message:"Something went wrong"});

})
const deleteChildArticle = asyncHandler(async function (req,res){    
    const flag=await deleteService(req.body.articleId)                 //cruD. THIS IS FOR SIDEBAR
    if(flag)
    res.status(201).json({message:"Deleted Successfully"});
    else
    res.status(500).json({message:"Something went wrong"});
})

const getChildren=asyncHandler(async function (req,res){
    const result=await child(req.params.articleId);
    res.status(200).json({data:result})
})
const getName=asyncHandler(async function (req,res){
    res.status(200).json(await getNameService(req.params.articleId))
})


module.exports = { getChildArticles, createChildArticle, patchChildArticle, deleteChildArticle,getChildren,getName }