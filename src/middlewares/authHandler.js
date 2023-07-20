const asyncHandler = require('express-async-handler');
const customError = require('../utils/customError');
const ac = require('../config/roles');


// Middleware for authorization
const authorize = (action,resource) => {
    return asyncHandler(async (req, res, next) => {
        
        const permission = ac.can(req.user.role)[action](resource);
        
        if (permission.granted)
            next(); 
        else
            throw new customError('Unauthorized Access', 401);

    })
};

function allowIfLoggedin (req, res, next) {
 
    try {
      const user = req.user;
      if (!user){
        return res.status(401).json({ status: "error",  data: {message: "Please login to access this path."} });
      }else{
    
      next();
      }
    } catch (error) {
      next(error);
    }
  }

module.exports = {authorize,allowIfLoggedin};