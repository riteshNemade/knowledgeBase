const asyncHandler = require('express-async-handler');

const {
    createService
} = require('../services/cloneService');


const createClone = asyncHandler(async function (req, res) {
    const id = await createService(req.body)
    res.status(201).json({ id })
})




module.exports = { createClone }