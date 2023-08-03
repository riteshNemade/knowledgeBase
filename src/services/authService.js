const { db } = require('../config/database');
const customError = require('../utils/customError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { 
    resetToken, 
    generateToken 
} = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

/**************************************Sign Up Service*************************************************/
async function signUp(body) {
    //check username availability
    await db('users')
        .select('username')
        .where('username', body.username)
        .orWhere('email', body.email)
        .first()
        .then((result) => {
            if (result)
                throw new customError('Username/email already registered. Please login instead.', 409);
        })

    const timestamp = new Date;
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = {
        full_name: body.fullName,
        username: body.username,
        email: body.email,
        password: hashedPassword,
        role: body.role || "viewer",        //assigned viewer by default.
        department: body.department,
        created_at: timestamp,
        updated_at: timestamp
    };

    //validation successful. Adding user
    await db('users').insert(newUser);

    const user =
        await db('users')
            .select('username', 'role', 'user_id', 'email', 'password')
            .where('username', body.username)
            .first();

    if (user && (await bcrypt.compare(body.password, user.password))) {
        const accessToken = generateToken(user);
        return {
            "name": user.username,
            "email": user.email,
            "role": user.role,
            "token": accessToken
        }
    } else {
        throw new customError('There was an error. Contact System Administrator', 500);
    }

}
/***************************************Sign in Service**********************************************/
async function signIn(body) {
    const user =
        await db('users')
            .select('*')
            .where('username', body.username)
            .first();


    if (user && (await bcrypt.compare(body.password, user.password))) {
        const accessToken = generateToken(user);
        return {
            "name": user.username,
            "user_id": user.user_id,
            "email": user.email,
            "role": user.role,
            "token": accessToken
        }
    } else {
        throw new customError('Login Failed.', 401);
    }

}
/*****************************************Find User by Email********************************************/
async function findByEmail(email, result) {
    db('users')
        .select('user_id', 'email')
        .where('email', email)
        .then((row) => {
            if (!row)
                result(true);
            else {
                result(null);
            }
        })
}
/************************Forgot and Reset Password service*******************************************/
async function forgotPwd(email) {
    const rToken = resetToken(email);   //reset tokens are valid for 15 minutes
    const resetUrl = `${process.env.BASE_URL}?token=${rToken}`;

    const result = await db('reset_password').insert({
        token: rToken,
        email: email,
        created_at: new Date(),
    }).onConflict('email')            //if requested again, merge the requests and replace the token
        .merge({ token: rToken, created_at: new Date() })
        .catch((err) => {
            console.error(err);
        })
    console.log(result)
    const text = "To reset your password, use the following link:\n\n" + resetUrl + "\n\nDo not share this link with anyone."
    await sendEmail(email, "Password Reset Link", text);    //send email to the user's email ID
    return { "message": "Password reset email has been sent." }
}


async function resetPwd(token, newPassword) {
    var flag = false;
    try {
        let result = await jwt.verify(token, process.env.SECRET_KEY);    //token verification
        //query reset password table.
        await db('reset_password')
            .where('email', result.email)
            .where('token', token)
            .del()                      //delete the entry from the reset password table
            .then((rowsDeleted) => {
                if (rowsDeleted > 0)
                    flag = true;        //set flag to true allowing the function to proceed and add new password to the user table
            })
            .catch((err) => {
                throw new customError(err.message, 500);
            })
        if (flag) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            db('users').where('email', result.email).update('password', hashedPassword)
            return { "message": "Password updated successfully." }
        }
    } catch (err) {
        throw new customError(err.message, 400)
    }

}



module.exports = {
    signUp,
    signIn,
    forgotPwd,
    resetPwd,
    findByEmail
};
