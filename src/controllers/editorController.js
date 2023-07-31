const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');


const {
    createService,
    getService
} = require('../services/editorService');


const createEditor = asyncHandler(async function (req, res) {
    
    let result = await createService(req.body, req.user.user_id);

    if (!result)
        throw new customError('Cannot Add', 500)
    else {
        res.status(201).json({
            success: true,
            message: "Created successfully",
            result
        });
    }
})



module.exports = { createEditor, }