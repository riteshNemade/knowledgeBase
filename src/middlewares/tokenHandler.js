const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const customError = require('../utils/customError');
require('dotenv').config();

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader) {
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            if (!token)
                throw new customError('Missing Authorization.', 401);

            jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
                if (err)
                    throw new customError('Unauthorized Access', 401);
                else {
                    req.user = decode;
                    next();
                }
            });
        }
    } else {
        next();
    }
})

module.exports = validateToken;
