const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService,
    createService,
    patchService,
    deleteService,
    views,
    likes,
    dislike,
    getLikesService,
    getUserLikeService
} = require('../services/articleService');

const getArticle = asyncHandler(async function (req,res){
    res.status(201).json(await getService(req.params.parentId));
})
const incViews = asyncHandler(async function (req,res){
    res.status(201).json(await views(req.params.parentId));
})

//like handlers
const incLikes = asyncHandler(async function (req,res){
    res.status(201).json(await likes(req.body.articleId,req.user.user_id));
})
const getLikes = asyncHandler(async function (req,res){
    const result=await getLikesService(req.params.articleId)
    res.status(201).json(result[0]);
})
const getUserLike = asyncHandler(async function (req,res){
    const result=await getUserLikeService(req.params.articleId,req.user.user_id)
    res.status(201).json(result);
})
const decLikes = asyncHandler(async function (req,res){
    res.status(201).json(await dislike(req.body.articleId,req.user.user_id));
})





const createArticle = asyncHandler(async function (req, res) {
    if (!req.body.articleName||!req.user.user_id||!req.body.parentId)
        throw new customError('Provide appropiate details.', 400);

    let result = await createService(req.body, req.user.user_id);

    if (!result)
        throw new customError('Cannot create Article', 500)
    else {
        res.status(201).json({
            success: true,
            message: "Created successfully",
            data:[{
                "articleId":result.articleId,
                "contentId":result.contentId
            }]
        });
    }
})

const patchArticle = asyncHandler(async function (req, res) {
    if(!req.body.articleId)
        throw new customError('Provide article ID',400);
        
    const result = await patchService(req.body);
    if (result)
        res.status(200).json({ "message": "Updated Successfully" });
    else
        res.status(500).json({ "status": "error", "message": "Update failed." });
})

const deleteArticle = asyncHandler(async function (req, res) {
    await deleteService(req.body);
    res.status(200).json({
        "message": "Deleted successfully",
        data: null
    });
})

module.exports = { getArticle, createArticle, patchArticle, deleteArticle,incViews,incLikes,getLikes,decLikes,getUserLike }