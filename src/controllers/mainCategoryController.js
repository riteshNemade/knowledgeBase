const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {
    getService,
    createService,
    patchService,
    deleteService
} = require('../services/mainCategoryService');

const getMainCategory = asyncHandler(async function (req,res){
    res.status(200).json(await getService());
})

const createMainCategory = asyncHandler(async function (req, res) {
    if (!req.body.categoryName||!req.user.user_id)
        throw new customError('Provide appropiate details.', 400);

    let result = await createService(req.body, req.user.user_id);

    if (!result)
        throw new customError('Cannot create Main Cateogry', 500)
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

const patchMainCategory = asyncHandler(async function (req, res) {
    const result = await patchService(req.body);
    if (result)
        res.status(200).json({ "message": "Updated Successfully" });
    else
        res.status(500).json({ "status": "error", "message": "Update failed." });
})

const deleteMainCategory = asyncHandler(async function (req, res) {
    await deleteService(req.body.categoryId);
    res.status(200).json({
        "message": "Deleted successfully",
        data: null
    });
})

module.exports = { getMainCategory, createMainCategory, patchMainCategory, deleteMainCategory }