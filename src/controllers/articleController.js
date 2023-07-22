const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService,
    createService,
    patchService,
    deleteService
} = require('../services/articleService');

const getArticle = asyncHandler(async function (req,res){
    res.status(201).json(await getService(req.body.parentId));
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
                "id":result
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

module.exports = { getArticle, createArticle, patchArticle, deleteArticle }