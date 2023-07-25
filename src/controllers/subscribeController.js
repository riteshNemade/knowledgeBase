const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');


const {
    subscribeService,
    unsubscribeService,
} = require('../services/subscribeService');


const subscribe = asyncHandler(async function (req, res) {
    
    let result = await subscribeService(req.body, req.user.user_id);

    if (!result)
        throw new customError('Cannot create Article', 500)
    else {
        res.status(201).json({
            success: true,
            message: "Created successfully",
            result
        });
    }
})

const unsubscribe = asyncHandler(async function (req, res) {
    
    let result = await unsubscribeService(req.body, req.user.user_id);

    if (!result)
        throw new customError('Cannot create Article', 500)
    else {
        res.status(201).json({
            success: true,
            message: "Created successfully",
            result
        });
    }
})


module.exports = { subscribe,unsubscribe }