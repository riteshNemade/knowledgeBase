const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');

const {

    createService,

} = require('../services/cloneService');


const createClone = asyncHandler(async function (req,res){       
    const id=await createService(req.body)              //Crud. THIS IS FOR SIDEBAR
    res.status(201).json({id})
})



module.exports = { createClone }