const jwt=require('jsonwebtoken');


function generateToken(user) {
    const accessToken = jwt.sign({
        username: user.username,
        email:user.email,
        role: user.role,
        user_id:user.user_id
    },
    process.env.SECRET_KEY,
    { expiresIn:"12h"}
    )
    return accessToken;
}

function resetToken(email) {
    const accessToken = jwt.sign({ "email":email },
    process.env.SECRET_KEY,
    { expiresIn:"15m"}
    )
    return accessToken;
}
module.exports= {generateToken,resetToken};
